import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "./quizSlice";

// Create the Redux store and register the quiz reducer.
const store = configureStore({
  reducer: {
    // Keep quiz-related state under the "quiz" key.
    quiz: quizReducer,
  },
});

// Export the store so the application can access it through Provider.
export default store;