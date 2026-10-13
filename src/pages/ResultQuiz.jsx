
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  LinearProgress,
  Divider,
} from "@mui/material";

function ResultQuiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read the completed quiz attempt passed from PlayQuiz.
  const {
    fullName,
    quizTitle,
    totalQuestions,
    score,
    questions,
    answers,
  } = location.state || {};

  // Control whether the answer review is visible.
  const [showAnswers, setShowAnswers] = useState(false);

  // Prevent access to results without a valid completed quiz.
  if (
    !fullName ||
    !quizTitle ||
    !Number.isFinite(score) ||
    !Number.isFinite(totalQuestions) ||
    totalQuestions <= 0 ||
    score < 0 ||
    score > totalQuestions
  ) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 5 }}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              No Quiz Results
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Complete a quiz to view your results.
            </Typography>

            <Button variant="contained" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Calculate the percentage score.
  const percentage = Math.round((score / totalQuestions) * 100);

  let performance;
  let resultColor;

  // 60% and below: Failed (red).
  // Above 60% and below 80%: Pass (blue).
  // 80% and above: Excellent (green).
  if (percentage <= 60) {
    performance = "Failed";
    resultColor = "error";
  } else if (percentage < 80) {
    performance = "Pass";
    resultColor = "info";
  } else {
    performance = "Excellent";
    resultColor = "success";
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 5 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Quiz Completed!
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Congratulations, {fullName}
          </Typography>

          <Typography variant="h6" sx={{ mb: 3 }}>
            {quizTitle}
          </Typography>

          {/* Display the percentage in the category's color. */}
          <Typography
            variant="h2"
            color={`${resultColor}.main`}
            fontWeight="bold"
          >
            {percentage}%
          </Typography>

          <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
            {score} out of {totalQuestions} correct
          </Typography>

          {/* Match the progress bar color to the result category. */}
          <LinearProgress
            variant="determinate"
            value={percentage}
            color={resultColor}
            sx={{ height: 10, borderRadius: 5, mb: 3 }}
          />

          <Typography
            variant="h5"
            color={`${resultColor}.main`}
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            {performance}
          </Typography>

          {/* Show or hide the answer review. */}
          {Array.isArray(questions) && questions.length > 0 && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowAnswers((previous) => !previous)}
              sx={{ mb: 3 }}
            >
              {showAnswers ? "Hide Correct Answers" : "View Correct Answers"}
            </Button>
          )}

          {/* Compare selected answers with the correct answers. */}
          {showAnswers && Array.isArray(questions) && (
            <Box sx={{ textAlign: "left", mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Answer Review
              </Typography>

              {questions.map((question, index) => {
                const correctIndex = Number(question.correctAnswer) - 1;

                // Convert the selected option number to its array index.
                const selectedIndex =
                  Array.isArray(answers) &&
                  Number.isFinite(answers[index]) &&
                  answers[index] > 0
                    ? answers[index] - 1
                    : -1;

                const correctAnswer = question.options?.[correctIndex];

                const selectedAnswer =
                  selectedIndex >= 0
                    ? question.options?.[selectedIndex]
                    : undefined;

                const isCorrect =
                  selectedIndex >= 0 &&
                  Number(question.correctAnswer) === selectedIndex + 1;

                return (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>
                      {index + 1}. {question.question}
                    </Typography>

                    {/* Use a red background for wrong answers and green for correct ones. */}
                    <Box
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: isCorrect ? "success.light" : "error.light",
                        color: isCorrect ? "success.dark" : "error.dark",
                        overflowWrap: "anywhere",
                      }}
                    >
                      <Typography fontWeight="bold">
                        Your answer: {selectedAnswer ?? "Not answered"}
                        {isCorrect ? " ✓" : " ✗"}
                      </Typography>
                    </Box>

                    {/* Always show the correct answer with a green background. */}
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "success.light",
                        color: "success.dark",
                        overflowWrap: "anywhere",
                      }}
                    >
                      <Typography fontWeight="bold">
                        Correct answer: {correctAnswer ?? "Unavailable"} ✓
                      </Typography>
                    </Box>

                    {index < questions.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Navigate back to the home page. */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/")}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>

          {/* Allow the participant to attempt another quiz. */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/authentication")}
          >
            Play Again
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default ResultQuiz;
