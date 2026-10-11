
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load saved quizzes from localStorage.
export const loadQuizzes = createAsyncThunk(
  "quiz/loadQuizzes",
  async () => {
    const storedData = localStorage.getItem("question");
    return storedData ? JSON.parse(storedData) : [];
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quizzes: [],
    loading: false,
    error: null,
  },
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(loadQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setQuizzes } = quizSlice.actions;
export default quizSlice.reducer;
