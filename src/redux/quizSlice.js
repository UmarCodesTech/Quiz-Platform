
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load saved quizzes from localStorage asynchronously.
export const loadQuizzes = createAsyncThunk(
  "quiz/loadQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const storedData = localStorage.getItem("question");

      // Return an empty array if no quizzes exist.
      if (!storedData) {
        return [];
      }

      // Convert the saved JSON string into JavaScript data.
      const parsedData = JSON.parse(storedData);

      // Ensure the saved data is an array.
      if (!Array.isArray(parsedData)) {
        return rejectWithValue(
          "Saved quiz data is not in the expected format."
        );
      }

      return parsedData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to load saved quizzes."
      );
    }
  }
);

// Initial Redux state.
const initialState = {
  quizzes: [],
  loading: false,
  error: null,
};

// Create the quiz slice.
const quizSlice = createSlice({
  name: "quiz",
  initialState,

  // Synchronous reducers.
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
  },

  // Handle asynchronous thunk states.
  extraReducers: (builder) => {
    builder
      .addCase(loadQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loadQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
        state.error = null;
      })

      .addCase(loadQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Failed to load quizzes.";
      });
  },
});

// Export the synchronous action.
export const { setQuizzes } = quizSlice.actions;

// Export the reducer for the Redux store.
export default quizSlice.reducer;
