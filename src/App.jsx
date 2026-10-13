import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import MyQuiz from "./pages/MyQuiz";
import Authentication from "./pages/Authentication";
import PlayQuiz from "./pages/PlayQuiz";
import ResultQuiz from "./pages/ResultQuiz";
import Navbar from "./components/Navbar";

function App() {
  return (
    // Enable client-side routing for the entire application.
    <BrowserRouter>
      {/* Display the navigation bar across all pages. */}
      <Navbar />

      {/* Render the page that matches the current URL. */}
      <Routes>
        {/* Main landing page. */}
        <Route path="/" element={<Home />} />

        {/* Page for creating and saving quizzes. */}
        <Route path="/create-quiz" element={<CreateQuiz />} />

        {/* Page for viewing, editing, and deleting saved quizzes. */}
        <Route path="/my-quizzes" element={<MyQuiz />} />

        {/* Collect the participant's name before starting a quiz. */}
        <Route path="/authentication" element={<Authentication />} />

        {/* Page where participants answer quiz questions. */}
        <Route path="/play-quiz" element={<PlayQuiz />} />

        {/* Display the participant's score and answer review. */}
        <Route path="/result" element={<ResultQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
