
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";

function MyQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editQuestions, setEditQuestions] = useState([]);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("question");

      if (storedData) {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          setQuizzes(parsedData);
        }
      }
    } catch (error) {
      console.error("Unable to read saved quizzes:", error);
    }
  }, []);

  const persistQuizzes = (updatedQuizzes) => {
    localStorage.setItem("question", JSON.stringify(updatedQuizzes));
    setQuizzes(updatedQuizzes);
  };

  // Update a quiz's Active/Inactive status.
  const handleStatusChange = (quizId, newStatus) => {
    const updatedQuizzes = quizzes.map((quiz) =>
      quiz.id === quizId ? { ...quiz, status: newStatus } : quiz
    );

    persistQuizzes(updatedQuizzes);
  };

  // Open the delete confirmation dialog.
  const handleDeleteClick = (quiz) => {
    setSelectedQuiz(quiz);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedQuiz(null);
  };

  // Delete the selected quiz.
  const handleConfirmDelete = () => {
    if (!selectedQuiz) return;

    const updatedQuizzes = quizzes.filter(
      (quiz) => quiz.id !== selectedQuiz.id
    );

    persistQuizzes(updatedQuizzes);
    setDeleteDialogOpen(false);
    setSelectedQuiz(null);
  };

  // Open the edit dialog with the selected quiz's existing data.
  const handleEditClick = (quiz) => {
    setEditingQuizId(quiz.id);
    setEditTitle(quiz.quizTitle || "");
    setEditQuestions(
      (quiz.questions || []).map((item) => ({
        question: item.question || "",
        options: Array.isArray(item.options) ? [...item.options] : [],
        correctAnswer: item.correctAnswer ?? "",
      }))
    );
    setEditError("");
    setEditDialogOpen(true);
  };

  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setEditingQuizId(null);
    setEditError("");
  };

  // Update a question's text or correct answer.
  const handleQuestionChange = (questionIndex, field, value) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) =>
        index === questionIndex ? { ...item, [field]: value } : item
      )
    );
  };

  // Update one option.
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) => {
        if (index !== questionIndex) return item;

        const updatedOptions = [...item.options];
        updatedOptions[optionIndex] = value;

        return { ...item, options: updatedOptions };
      })
    );
  };

  // Add another option to a question.
  const handleAddOption = (questionIndex) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) =>
        index === questionIndex
          ? { ...item, options: [...item.options, ""] }
          : item
      )
    );
  };

  // Remove an option and keep the correct-answer index consistent.
  const handleRemoveOption = (questionIndex, optionIndex) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) => {
        if (index !== questionIndex) return item;

        const updatedOptions = item.options.filter(
          (_, i) => i !== optionIndex
        );

        let updatedCorrectAnswer = item.correctAnswer;

        if (updatedCorrectAnswer !== "") {
          const answerNumber = Number(updatedCorrectAnswer);

          if (answerNumber === optionIndex + 1) {
            updatedCorrectAnswer = "";
          } else if (answerNumber > optionIndex + 1) {
            updatedCorrectAnswer = answerNumber - 1;
          }
        }

        return {
          ...item,
          options: updatedOptions,
          correctAnswer: updatedCorrectAnswer,
        };
      })
    );
  };

  // Add a new blank question to the edit dialog.
  const handleAddQuestion = () => {
    setEditQuestions((previousQuestions) => [
      ...previousQuestions,
      {
        question: "",
        options: ["", ""],
        correctAnswer: "",
      },
    ]);
    setEditError("");
  };

  // Remove a question from the quiz.
  const handleRemoveQuestion = (questionIndex) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.filter((_, index) => index !== questionIndex)
    );
    setEditError("");
  };

  // Validate and save the edited quiz.
  const handleSaveEdit = () => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle.length < 10 || trimmedTitle.length > 30) {
      setEditError("Quiz title must be between 10 and 30 characters.");
      return;
    }

    if (editQuestions.length === 0) {
      setEditError("A quiz must contain at least one question.");
      return;
    }

    for (let i = 0; i < editQuestions.length; i++) {
      const item = editQuestions[i];

      if (item.question.trim().length < 10 || item.question.trim().length > 200) {
        setEditError(
          `Question ${i + 1} must be between 10 and 200 characters.`
        );
        return;
      }

      if (item.options.filter((option) => option.trim() !== "").length < 2) {
        setEditError(
          `Question ${i + 1}: Atleast two option required to save question`
        );
        return;
      }

      const answerNumber = Number(item.correctAnswer);
      const correctOption = item.options[answerNumber - 1];

      if (
        item.correctAnswer === "" ||
        !correctOption ||
        !correctOption.trim()
      ) {
        setEditError(
          `Please select a valid correct answer for question ${i + 1}.`
        );
        return;
      }
    }

    try {
      const updatedQuestions = editQuestions.map((item) => ({
        question: item.question.trim(),
        options: item.options.map((option) => option.trim()),
        correctAnswer: Number(item.correctAnswer),
      }));

      const updatedQuizzes = quizzes.map((quiz) =>
        quiz.id === editingQuizId
          ? {
              ...quiz,
              quizTitle: trimmedTitle,
              questions: updatedQuestions,
            }
          : quiz
      );

      persistQuizzes(updatedQuizzes);
      handleCloseEdit();
    } catch (error) {
      console.error("Unable to save quiz:", error);
      setEditError("Unable to save the changes. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Quizzes
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          View and manage the quizzes you have created.
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Quiz Title</strong></TableCell>
                <TableCell><strong>Questions</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Created Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {quizzes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No quizzes found. Create a quiz first.
                  </TableCell>
                </TableRow>
              ) : (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.quizTitle}</TableCell>

                    <TableCell>{quiz.questions?.length ?? 0}</TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={quiz.status || "Active"}
                            onChange={(event) =>
                              handleStatusChange(quiz.id, event.target.value)
                            }
                          >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                          </Select>
                        </FormControl>

                        <Chip
                          label={quiz.status || "Active"}
                          color={
                            (quiz.status || "Active") === "Active"
                              ? "success"
                              : "default"
                          }
                          size="small"
                        />
                      </Box>
                    </TableCell>

                    <TableCell>
                      {quiz.createdAt
                        ? new Date(quiz.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => handleEditClick(quiz)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(quiz)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit quiz dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Quiz</DialogTitle>

        <DialogContent dividers>
          <TextField
            label="Quiz Title"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            fullWidth
            required
            inputProps={{ maxLength: 30 }}
            helperText={`${editTitle.length}/30 characters (minimum 10)`}
            sx={{ mt: 1, mb: 3 }}
          />

          {editQuestions.map((item, questionIndex) => (
            <Paper
              key={questionIndex}
              variant="outlined"
              sx={{ p: 2, mb: 3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Question {questionIndex + 1}
                </Typography>

                <Button
                  color="error"
                  size="small"
                  onClick={() => handleRemoveQuestion(questionIndex)}
                >
                  Remove Question
                </Button>
              </Box>

              <TextField
                label="Question"
                value={item.question}
                onChange={(event) =>
                  handleQuestionChange(
                    questionIndex,
                    "question",
                    event.target.value
                  )
                }
                fullWidth
                multiline
                minRows={2}
                inputProps={{ maxLength: 200 }}
                helperText={`${item.question.length}/200 characters (minimum 10)`}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Answer Options
              </Typography>

              {item.options.map((option, optionIndex) => (
                <Box
                  key={optionIndex}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <TextField
                    label={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(event) =>
                      handleOptionChange(
                        questionIndex,
                        optionIndex,
                        event.target.value
                      )
                    }
                    fullWidth
                    size="small"
                  />

                  <IconButton
                    color="error"
                    aria-label={`Remove option ${optionIndex + 1}`}
                    disabled={item.options.length <= 2}
                    onClick={() =>
                      handleRemoveOption(questionIndex, optionIndex)
                    }
                  >
                    ×
                  </IconButton>
                </Box>
              ))}

              <Button
                size="small"
                onClick={() => handleAddOption(questionIndex)}
                sx={{ mb: 2 }}
              >
                + Add Option
              </Button>

              <FormControl fullWidth>
                <TextField
                  select
                  label="Correct Answer"
                  value={item.correctAnswer}
                  onChange={(event) =>
                    handleQuestionChange(
                      questionIndex,
                      "correctAnswer",
                      event.target.value
                    )
                  }
                >
                  {item.options.map((option, optionIndex) => (
                    <MenuItem
                      key={optionIndex}
                      value={optionIndex + 1}
                      disabled={!option.trim()}
                    >
                      Option {optionIndex + 1}
                      {option.trim() ? ` — ${option}` : " — Empty"}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Paper>
          ))}

          <Button variant="outlined" onClick={handleAddQuestion}>
            + Add Question
          </Button>

          {editError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {editError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Quiz?</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedQuiz?.quizTitle}</strong>? This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancelDelete}>No</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyQuiz;
