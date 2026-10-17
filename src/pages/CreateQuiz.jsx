
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { setQuizzes } from "../redux/quizSlice";

function CreateQuiz() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);
  const [questionType, setQuestionType] = useState("single");
  const [showForm, setShowForm] = useState(false);

  const [quizTitle, setQuizTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState("");
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);

  // Open the form for the supported question type.
  const handleContinue = () => {
    if (questionType === "single") {
      setShowForm(true);
      setOpen(false);
      setError("");
    } else {
      alert("This question type will be implemented in a later step.");
    }
  };

  // Add another option.
  const handleAddOption = () => {
    setOptions((previousOptions) => [...previousOptions, ""]);
    setError("");
    setValidationSuccess(false);
  };

  // Update an option.
  const handleOptionChange = (index, value) => {
    setOptions((previousOptions) =>
      previousOptions.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );

    setError("");
    setValidationSuccess(false);
  };

  // Delete an option without allowing fewer than two.
  const handleDeleteOption = (index) => {
    if (options.length <= 2) {
      setError("At least two options are required.");
      return;
    }

    setOptions((previousOptions) =>
      previousOptions.filter((_, optionIndex) => optionIndex !== index)
    );

    if (correctAnswer === String(index + 1)) {
      setCorrectAnswer("");
    } else if (Number(correctAnswer) > index + 1) {
      setCorrectAnswer(String(Number(correctAnswer) - 1));
    }

    setError("");
    setValidationSuccess(false);
  };

  // Validate the quiz title, question, options, and correct answer.
  const validateQuestion = () => {
    if (quizTitle.trim().length < 10 || quizTitle.trim().length > 30) {
      setError("Quiz title must be between 10 and 30 characters.");
      setValidationSuccess(false);
      return false;
    }

    if (question.trim().length < 10 || question.trim().length > 200) {
      setError("Question must be between 10 and 200 characters.");
      setValidationSuccess(false);
      return false;
    }

    const validOptions = options.filter(
      (option) => option.trim() !== ""
    );

    if (validOptions.length < 2) {
      setError("At least two non-empty options are required.");
      setValidationSuccess(false);
      return false;
    }

    if (
      !correctAnswer ||
      !options[Number(correctAnswer) - 1]?.trim()
    ) {
      setError("Please select a valid correct answer.");
      setValidationSuccess(false);
      return false;
    }

    setError("");
    setValidationSuccess(true);
    return true;
  };

  // Add the current question to the in-progress quiz.
  const handleAddQuestion = () => {
    if (!validateQuestion()) {
      return;
    }

    const newQuestion = {
      question: question.trim(),
      options: options.map((option) => option.trim()),
      correctAnswer: Number(correctAnswer),
    };

    setSavedQuestions((previousQuestions) => [
      ...previousQuestions,
      newQuestion,
    ]);

    setQuestion("");
    setOptions(["", ""]);
    setCorrectAnswer("");
    setError("");
    setValidationSuccess(false);
  };

  // Save the quiz to localStorage and update Redux.
  const handleSaveQuiz = () => {
    if (quizTitle.trim().length < 10 || quizTitle.trim().length > 30) {
      setError("Quiz title must be between 10 and 30 characters.");
      return;
    }

    const questionsToSave = [...savedQuestions];

    // Include the question currently in the form, if started.
    const hasCurrentQuestion =
      question.trim() !== "" ||
      options.some((option) => option.trim() !== "") ||
      correctAnswer !== "";

    if (hasCurrentQuestion) {
      if (!validateQuestion()) {
        return;
      }

      questionsToSave.push({
        question: question.trim(),
        options: options.map((option) => option.trim()),
        correctAnswer: Number(correctAnswer),
      });
    }

    // Require at least 10 complete questions.
    if (questionsToSave.length < 10) {
      setError("Please add at least 10 questions to save this quiz.");
      return;
    }

    try {
      const existingData = localStorage.getItem("question");
      const existingQuizzes = existingData
        ? JSON.parse(existingData)
        : [];

      if (!Array.isArray(existingQuizzes)) {
        setError(
          "Saved quiz data is invalid. Please check localStorage."
        );
        return;
      }

      const newQuiz = {
        id: Date.now(),
        quizTitle: quizTitle.trim(),
        questions: questionsToSave,
        status: "Active",
        createdAt: new Date().toISOString(),
      };

      // Preserve all existing quizzes.
      const updatedQuizzes = [...existingQuizzes, newQuiz];

      // Persist first; update Redux only after storage succeeds.
      localStorage.setItem("question", JSON.stringify(updatedQuizzes));
      dispatch(setQuizzes(updatedQuizzes));

      // Reset the form after successful saving.
      setSavedQuestions([]);
      setQuestion("");
      setOptions(["", ""]);
      setCorrectAnswer("");
      setQuizTitle("");
      setError("");
      setValidationSuccess(false);
      setSuccessOpen(true);
    } catch (saveError) {
      console.error("Unable to save quiz:", saveError);
      setError("Unable to save the quiz. Please try again.");
    }
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
  };

  const handleViewQuizzes = () => {
    setSuccessOpen(false);
    navigate("/my-quizzes");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Quiz
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Select Question Type
        </Button>

        {showForm && (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Single Correct Answer MCQ
            </Typography>

            <TextField
              fullWidth
              label="Quiz Title"
              value={quizTitle}
              onChange={(event) => {
                setQuizTitle(event.target.value);
                setError("");
                setValidationSuccess(false);
              }}
              slotProps={{ htmlInput: { maxLength: 30 } }}
              helperText="Enter 10–30 characters"
              sx={{ mb: 3, mt: 1 }}
            />

            {savedQuestions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">
                  Questions added: {savedQuestions.length}
                </Typography>

                {savedQuestions.map((item, index) => (
                  <Box key={index} sx={{ py: 1 }}>
                    <Typography>
                      {index + 1}. {item.question}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ mt: 1 }} />
              </Box>
            )}

            <TextField
              fullWidth
              label="Question"
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                setError("");
                setValidationSuccess(false);
              }}
              slotProps={{ htmlInput: { maxLength: 200 } }}
              helperText="Enter 10–200 characters"
              multiline
              minRows={2}
              sx={{ mb: 3 }}
            />

            <Typography variant="h6" gutterBottom>
              Options
            </Typography>

            {options.map((option, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 1,
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(event) =>
                    handleOptionChange(index, event.target.value)
                  }
                />

                <Button
                  color="error"
                  onClick={() => handleDeleteOption(index)}
                  disabled={options.length <= 2}
                >
                  Delete
                </Button>
              </Box>
            ))}

            <Button
              variant="outlined"
              onClick={handleAddOption}
            >
              Add Option
            </Button>

            <TextField
              select
              fullWidth
              label="Correct Answer"
              value={correctAnswer}
              onChange={(event) => {
                setCorrectAnswer(event.target.value);
                setError("");
                setValidationSuccess(false);
              }}
              sx={{ mt: 3 }}
            >
              {options.map((option, index) => (
                <MenuItem
                  key={index}
                  value={String(index + 1)}
                  disabled={!option.trim()}
                >
                  Option {index + 1}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {validationSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Validation successful! Proceed with adding the question.
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                onClick={validateQuestion}
              >
                Validate Question
              </Button>

              <Button
                variant="outlined"
                onClick={handleAddQuestion}
              >
                Add Question
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveQuiz}
              >
                Save Quiz
              </Button>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Question type selection dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Select Question Type</DialogTitle>

        <DialogContent>
          <FormControl>
            <RadioGroup
              value={questionType}
              onChange={(event) =>
                setQuestionType(event.target.value)
              }
            >
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="MCQ — Single Correct Answer"
              />

              <FormControlLabel
                value="multiple"
                control={<Radio />}
                label="MCQ — Multiple Correct Answers"
              />

              <FormControlLabel
                value="short"
                control={<Radio />}
                label="Short Answer (2 words)"
              />

              <FormControlLabel
                value="description"
                control={<Radio />}
                label="Description (2 or 4 sentences)"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save confirmation dialog */}
      <Dialog
        open={successOpen}
        onClose={handleCloseSuccess}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Question created successfully</DialogTitle>

        <DialogContent>
          <Typography>
            Your quiz and its questions have been saved successfully.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseSuccess}>
            Close
          </Button>

          <Button
            variant="contained"
            onClick={handleViewQuizzes}
          >
            View all questions
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CreateQuiz;
