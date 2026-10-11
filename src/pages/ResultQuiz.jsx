
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  LinearProgress,
} from "@mui/material";

function ResultQuiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    fullName,
    quizTitle,
    totalQuestions,
    score,
  } = location.state || {};

  // Handle direct access without a submitted quiz.
  if (
    !fullName ||
    !quizTitle ||
    !Number.isFinite(score) ||
    !Number.isFinite(totalQuestions) ||
    totalQuestions <= 0
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

            <Button
              variant="contained"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  const percentage = Math.round((score / totalQuestions) * 100);

  let performance;

  if (percentage >= 80) {
    performance = "Excellent work!";
  } else if (percentage >= 60) {
    performance = "Good job!";
  } else if (percentage >= 40) {
    performance = "Keep practising!";
  } else {
    performance = "Keep learning and try again!";
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

          <Typography
            variant="h2"
            color="primary.main"
            fontWeight="bold"
          >
            {percentage}%
          </Typography>

          <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>
            {score} out of {totalQuestions} correct
          </Typography>

          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{ height: 10, borderRadius: 5, mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 4 }}>
            {performance}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/")}
            sx={{ mb: 2 }}
          >
            Back to Home
          </Button>

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
