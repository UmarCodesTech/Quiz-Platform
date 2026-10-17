
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  MenuItem,
  Select,
  Alert,
  LinearProgress,
} from "@mui/material";

function PlayQuiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read the participant name from session storage.
  const fullName = sessionStorage.getItem("participantName") || "";

  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");

  // Load active quizzes from localStorage.
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("question");
      const parsedData = storedData ? JSON.parse(storedData) : [];

      if (Array.isArray(parsedData)) {
        setActiveQuizzes(
          parsedData.filter(
            (quiz) =>
              quiz.status === "Active" &&
              Array.isArray(quiz.questions) &&
              quiz.questions.length > 0
          )
        );
      }
    } catch (error) {
      console.error("Unable to load quizzes:", error);
      setError("Unable to load saved quizzes.");
    }
  }, []);

  // Switch participant and abandon the current attempt.
  const handleChangeUser = () => {
    sessionStorage.removeItem("participantName");
    navigate("/authentication", {
      state: { changeUser: true },
    });
  };

  // Start the selected quiz.
  const handleStartQuiz = () => {
    const quiz = activeQuizzes.find(
      (item) => String(item.id) === String(selectedQuizId)
    );

    if (!quiz) {
      setError("Please select a quiz to begin.");
      return;
    }

    setCurrentQuiz({
      ...quiz,
      questions: quiz.questions,
    });

    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setError("");
  };

  // Save the current answer and move forward or submit.
  const handleNext = () => {
    if (selectedAnswer === "") {
      setError("Please select an answer before continuing.");
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = Number(selectedAnswer);

    setAnswers(updatedAnswers);
    setError("");

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;

      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(
        updatedAnswers[nextIndex] !== undefined
          ? String(updatedAnswers[nextIndex])
          : ""
      );
    } else {
      // Calculate the final score.
      const score = currentQuiz.questions.reduce(
        (total, question, index) =>
          total +
          (Number(question.correctAnswer) === updatedAnswers[index] ? 1 : 0),
        0
      );

      // Send results to the Result page.
      navigate("/result", {
        state: {
          fullName,
          quizTitle: currentQuiz.quizTitle,
          totalQuestions: currentQuiz.questions.length,
          score,
          answers: updatedAnswers,
          questions: currentQuiz.questions,
        },
      });
    }
  };

  // Go to the previous question while preserving answers.
  const handlePrevious = () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    const updatedAnswers = [...answers];

    if (selectedAnswer !== "") {
      updatedAnswers[currentQuestionIndex] = Number(selectedAnswer);
    }

    setAnswers(updatedAnswers);

    const previousIndex = currentQuestionIndex - 1;

    setCurrentQuestionIndex(previousIndex);
    setSelectedAnswer(
      updatedAnswers[previousIndex] !== undefined
        ? String(updatedAnswers[previousIndex])
        : ""
    );

    setError("");
  };

  // Require a participant name before playing.
  if (!fullName) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 5 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Please enter your name before starting a quiz.
          </Alert>

          <Button
            variant="contained"
            onClick={() => navigate("/authentication")}
          >
            Enter Name
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Participant name and Change User option. */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Welcome, {fullName}
          </Typography>

          {!currentQuiz && (
            <Button
            variant="outlined"
            color="secondary"
            onClick={handleChangeUser}
          >
            Change User
          </Button>
          )}
        </Box>

        {!currentQuiz ? (
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mt: 3 }}>
            <Typography variant="h4" gutterBottom>
              Play Quiz
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Choose an active quiz to begin.
            </Typography>

            {activeQuizzes.length === 0 ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No active quizzes are available. Create a quiz or activate an
                existing one in My Quizzes.
              </Alert>
            ) : (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={selectedQuizId}
                  displayEmpty
                  onChange={(event) => {
                    setSelectedQuizId(event.target.value);
                    setError("");
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a quiz
                  </MenuItem>

                  {activeQuizzes.map((quiz) => (
                    <MenuItem key={quiz.id} value={String(quiz.id)}>
                      {quiz.quizTitle} ({quiz.questions.length} questions)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              disabled={activeQuizzes.length === 0}
              onClick={handleStartQuiz}
            >
              Start Quiz
            </Button>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 4 }, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              {currentQuiz.quizTitle}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Question {currentQuestionIndex + 1} of{" "}
              {currentQuiz.questions.length}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={
                ((currentQuestionIndex + 1) /
                  currentQuiz.questions.length) *
                100
              }
              sx={{ mb: 4 }}
            />

            <Typography variant="h6" sx={{ mb: 3 }}>
              {currentQuestion.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedAnswer}
                onChange={(event) => {
                  setSelectedAnswer(event.target.value);
                  setError("");
                }}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={String(index + 1)}
                    control={<Radio />}
                    label={option}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      px: 1,
                      py: 0.5,
                      mb: 1,
                      mx: 0,
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Previous and Next/Submit buttons. */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                disabled={selectedAnswer === ""}
              >
                {currentQuestionIndex === currentQuiz.questions.length - 1
                  ? "Submit Quiz"
                  : "Next"}
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default PlayQuiz;
