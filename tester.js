const cameraFeed = document.getElementById('cameraFeed');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const outputText = document.getElementById("outputText");
const detectedLetter = document.getElementById("detectedLetter");
const confidenceBar = document.getElementById("confidenceBar");
const confidenceValue = document.getElementById("confidenceValue");
const wordDisplay = document.getElementById("wordDisplay");
const clearWordBtn = document.getElementById("clearWordBtn");
const backspaceBtn = document.getElementById("backspaceBtn");

const MODEL_URL = "model/model.json";
const METADATA_URL = "model/metadata.json";

let model = null;
let webcam = null;
let isRunning = false;
let animFrame = null;

const BUFFER_SIZE = 15;
const CONFIDENCE_THRESHOLD = 0.75;
const HOLD_FRAMES = 30;

let predictionBuffer = [];
let currentWord = "";
let holdCounter = 0;
let lastAddedLetter = null;
let lastLetter = null;


async function loadModel() {
    try {
        outputText.innerText = "Loading model...";
        model = await tmPose.load(MODEL_URL, METADATA_URL);
        console.log("TM Pose model loaded:", model.getClassLabels());
        outputText.innerText = "Model loaded — click Start";
        detectedLetter.textContent = "?";
    } catch (err) {
        console.error("Model failed to load:", err);
        outputText.innerText = "Model failed to load. Check model/ folder has model.json, metadata.json, weights.bin.";
    }
}

loadModel();


async function startCamera() {
    if (!model) {
        outputText.innerText = "Model not loaded yet — please wait.";
        return;
    }

    try {
        webcam = new tmPose.Webcam(640, 480, true); // width, height, flip
        await webcam.setup();
        await webcam.play();

        // Append tmPose's canvas directly into the feed container
        cameraFeed.appendChild(webcam.canvas);
        cameraPlaceholder.style.display = "none";

        startBtn.disabled = true;
        stopBtn.disabled = false;
        isRunning = true;
        outputText.innerText = "Show your hand...";

        predictionLoop();
    } catch (err) {
        console.error("Camera failed:", err);
        outputText.innerText = "Camera error: " + err.message;
    }
}

// ── Prediction loop ──
async function predictionLoop() {
    if (!isRunning) return;

    webcam.update();

    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);

    if (pose && pose.score > 0.2) {
        const predictions = await model.predict(posenetOutput);
        handlePredictions(predictions);
    } else {
        clearDetection("No pose detected — make sure your upper body is visible");
    }

    animFrame = requestAnimationFrame(predictionLoop);
}

// ── Handle predictions ──
function handlePredictions(predictions) {
    const best = predictions.reduce((a, b) => a.probability > b.probability ? a : b);
    const letter = best.className.toUpperCase();
    const confidence = best.probability;

    predictionBuffer.push({ letter, confidence });
    if (predictionBuffer.length > BUFFER_SIZE) predictionBuffer.shift();

    const counts = {};
    let totalConf = 0;
    for (const p of predictionBuffer) {
        counts[p.letter] = (counts[p.letter] || 0) + 1;
        totalConf += p.confidence;
    }
    const smoothedLetter = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const avgConf = totalConf / predictionBuffer.length;
    const confPct = Math.round(avgConf * 100);

    confidenceBar.style.width = confPct + "%";
    confidenceValue.textContent = confPct + "%";

    if (avgConf >= CONFIDENCE_THRESHOLD) {
        detectedLetter.textContent = smoothedLetter;
        detectedLetter.style.color = "#00ffcc";
        outputText.innerText = `Detected: ${smoothedLetter} (${confPct}% confident)`;

        if (smoothedLetter === lastLetter) {
            holdCounter++;
            updateHoldRing(holdCounter / HOLD_FRAMES);

            if (holdCounter >= HOLD_FRAMES && smoothedLetter !== lastAddedLetter) {
                currentWord += smoothedLetter;
                wordDisplay.textContent = currentWord || "—";
                lastAddedLetter = smoothedLetter;
                holdCounter = 0;
                showFlash();
            }
        } else {
            holdCounter = 0;
            lastAddedLetter = null;
            updateHoldRing(0);
        }
        lastLetter = smoothedLetter;

    } else {
        detectedLetter.textContent = smoothedLetter;
        detectedLetter.style.color = "rgba(255,255,255,0.35)";
        outputText.innerText = `Uncertain — keep hand steady (${confPct}%)`;
        holdCounter = 0;
        lastLetter = null;
        updateHoldRing(0);
    }
}

function clearDetection(msg = "") {
    predictionBuffer = [];
    holdCounter = 0;
    lastAddedLetter = null;
    lastLetter = null;
    detectedLetter.textContent = "—";
    detectedLetter.style.color = "rgba(255,255,255,0.3)";
    confidenceBar.style.width = "0%";
    confidenceValue.textContent = "0%";
    updateHoldRing(0);
    if (msg) outputText.innerText = msg;
}

// ── Stop ──
function stopCamera() {
    isRunning = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    if (webcam) {
        webcam.stop();
        if (webcam.canvas && webcam.canvas.parentNode) {
            webcam.canvas.parentNode.removeChild(webcam.canvas);
        }
        webcam = null;
    }

    cameraPlaceholder.style.display = "flex";
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clearDetection("Camera stopped");
}

function updateHoldRing(progress) {
    const ring = document.getElementById("holdRing");
    if (!ring) return;
    const c = 2 * Math.PI * 45;
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c * (1 - Math.min(progress, 1));
}

function showFlash() {
    detectedLetter.classList.add("flash");
    setTimeout(() => detectedLetter.classList.remove("flash"), 400);
}

clearWordBtn.addEventListener("click", () => {
    currentWord = "";
    wordDisplay.textContent = "—";
});

backspaceBtn.addEventListener("click", () => {
    currentWord = currentWord.slice(0, -1);
    wordDisplay.textContent = currentWord || "—";
});

startBtn.addEventListener("click", startCamera);
stopBtn.addEventListener("click", stopCamera);