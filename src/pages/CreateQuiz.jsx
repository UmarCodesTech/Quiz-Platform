
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

function CreateQuiz() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [questionType, setQuestionType] = useState("single");
  const [showForm, setShowForm] = useState(false);

  const [quizTitle, setQuizTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState("");
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleContinue = () => {
    if (questionType === "single") {
      setShowForm(true);
      setOpen(false);
    } else {
      alert("This question type will be implemented in a later step.");
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleDeleteOption = (index) => {
    if (options.length <= 2) {
      setError("At least two options are required.");
      return;
    }

    setOptions(
      options.filter((_, optionIndex) => optionIndex !== index)
    );

    if (correctAnswer === String(index + 1)) {
      setCorrectAnswer("");
    } else if (Number(correctAnswer) > index + 1) {
      setCorrectAnswer(String(Number(correctAnswer) - 1));
    }

    setError("");
  };

  const validateQuestion = () => {
    if (quizTitle.trim().length < 10 || quizTitle.trim().length > 30) {
      setError("Quiz title must be between 10 and 30 characters.");
      return false;
    }

    if (question.trim().length < 10 || question.trim().length > 200) {
      setError("Question must be between 10 and 200 characters.");
      return false;
    }

    const validOptions = options.filter(
      (option) => option.trim() !== ""
    );

    if (validOptions.length < 2) {
      setError("Atleast two option required to save question");
      return false;
    }

    if (
      !correctAnswer ||
      !options[Number(correctAnswer) - 1]?.trim()
    ) {
      setError("Please select a valid correct answer.");
      return false;
    }

    setError("");
    return true;
  };

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
  };

  const handleSaveQuiz = () => {
    const hasCurrentQuestion =
      question.trim() !== "" ||
      options.some((option) => option.trim() !== "") ||
      correctAnswer !== "";

    let questionsToSave = [...savedQuestions];

    // Include the question currently in the form, if there is one.
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

    if (quizTitle.trim().length < 10 || quizTitle.trim().length > 30) {
      setError("Quiz title must be between 10 and 30 characters.");
      return;
    }

    if (questionsToSave.length === 0) {
      setError("Add at least one question before saving the quiz.");
      return;
    }

    try {
      const existingData = localStorage.getItem("question");
      const existingQuizzes = existingData
        ? JSON.parse(existingData)
        : [];

      if (!Array.isArray(existingQuizzes)) {
        setError("Saved quiz data is invalid. Please check localStorage.");
        return;
      }

      const newQuiz = {
        id: Date.now(),
        quizTitle: quizTitle.trim(),
        questions: questionsToSave,
        status: "Active",
        createdAt: new Date().toISOString(),
      };

      // Keep existing quizzes and append this new quiz.
      localStorage.setItem(
        "question",
        JSON.stringify([...existingQuizzes, newQuiz])
      );

      setSavedQuestions([]);
      setQuestion("");
      setOptions(["", ""]);
      setCorrectAnswer("");
      setQuizTitle("");
      setError("");
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
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Single Correct Answer MCQ
            </Typography>

            <TextField
              fullWidth
              label="Quiz Title"
              value={quizTitle}
              onChange={(event) => setQuizTitle(event.target.value)}
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
              onChange={(event) => setQuestion(event.target.value)}
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
              onChange={(event) => setCorrectAnswer(event.target.value)}
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
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
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
              onChange={(event) => setQuestionType(event.target.value)}
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
