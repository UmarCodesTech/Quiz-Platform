import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load saved quizzes from localStorage asynchronously.
export const loadQuizzes = createAsyncThunk(
  "quiz/loadQuizzes",
  async () => {
    const storedData = localStorage.getItem("question");

    // Return saved quizzes, or an empty array if none exist.
    return storedData ? JSON.parse(storedData) : [];
  }
);

const quizSlice = createSlice({
  name: "quiz",

  // Define the initial state for quiz data and loading status.
  initialState: {
    quizzes: [],
    loading: false,
    error: null,
  },

  reducers: {
    // Update the quizzes stored in the Redux state.
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
  },

  // Handle the pending, successful, and failed states of loadQuizzes.
  extraReducers: (builder) => {
    builder
      .addCase(loadQuizzes.pending, (state) => {
        // Indicate that the quizzes are being loaded.
        state.loading = true;
        state.error = null;
      })
      .addCase(loadQuizzes.fulfilled, (state, action) => {
        // Loading is complete; store the retrieved quizzes.
        state.loading = false;

        // Ensure the loaded data is an array before updating the state.
        state.quizzes = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(loadQuizzes.rejected, (state, action) => {
        // Stop loading and store the error if loading fails.
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the action so components can update the quiz state.
export const { setQuizzes } = quizSlice.actions;

// Export the reducer for registration in the Redux store.
export default quizSlice.reducer;