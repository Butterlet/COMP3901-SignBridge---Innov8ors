// store/slices/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  progress: {
    level: 'beginner',
    quizzesTaken: 0,
    averageScore: 0,
    signsLearned: 0,
    streak: 0
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Initialize progress from user data if it exists
      if (action.payload.progress) {
        state.progress = action.payload.progress;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.progress = initialState.progress;
    },
    updateProgress: (state, action) => {
      // Update progress in both state.progress and state.user.progress
      state.progress = { ...state.progress, ...action.payload };
      if (state.user) {
        state.user.progress = { ...state.user.progress, ...action.payload };
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setUser, logout, updateProgress, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;