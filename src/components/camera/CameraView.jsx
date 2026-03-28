import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

const CameraView = ({ onTranslation }) => {
  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [translation, setTranslation] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamRef.current && isCameraActive) {
        captureAndTranslate();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCameraActive]);

  const captureAndTranslate = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log('Capturing frame for translation');
  };

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "user"
  };

  return (
    <div className="camera-container">
      <h2 className="camera-title">JSL Translator</h2>

      <div className="camera-preview">
        {isCameraActive ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="camera-video"
          />
        ) : (
          <div className="camera-placeholder">
            <p>Camera is off</p>
          </div>
        )}

        <div className="camera-controls">
          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`btn ${isCameraActive ? 'btn-danger' : 'btn-primary'}`}
          >
            {isCameraActive ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>
      </div>

      <div className="translation-box">
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Translation:
        </h3>
        <p className="translation-text">
          {translation || 'Waiting for sign language input...'}
        </p>
      </div>
    </div>
  );
};

export default CameraView;