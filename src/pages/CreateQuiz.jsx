
import { useState } from "react";
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
} from "@mui/material";

function CreateQuiz() {
  const [open, setOpen] = useState(true);
  const [questionType, setQuestionType] = useState("single");
  const [showForm, setShowForm] = useState(false);

  const [quizTitle, setQuizTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [error, setError] = useState("");

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
      alert("At least two options are required.");
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
  };

  // Validate the quiz title, question, options, and correct answer.
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

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Quiz
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
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
              inputProps={{ maxLength: 30 }}
              helperText="Enter 10–30 characters"
              sx={{ mb: 3, mt: 1 }}
            />

            <TextField
              fullWidth
              label="Question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              inputProps={{ maxLength: 200 }}
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

            <Button variant="outlined" onClick={handleAddOption}>
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

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={validateQuestion}
            >
              Validate Question
            </Button>
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleContinue}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CreateQuiz;
