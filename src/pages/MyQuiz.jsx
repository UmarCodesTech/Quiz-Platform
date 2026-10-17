
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Alert,
  CircularProgress,
} from "@mui/material";

import { loadQuizzes, setQuizzes } from "../redux/quizSlice";

function MyQuiz() {
  const dispatch = useDispatch();

  // Read quiz data and loading status from Redux.
  const quizzes = useSelector((state) => state.quiz.quizzes);
  const loading = useSelector((state) => state.quiz.loading);
  const loadError = useSelector((state) => state.quiz.error);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editQuestions, setEditQuestions] = useState([]);
  const [editError, setEditError] = useState("");

  const [storageError, setStorageError] = useState("");

  // Load saved quizzes through Redux Thunk.
  useEffect(() => {
    dispatch(loadQuizzes());
  }, [dispatch]);

  // Persist changes to localStorage and update Redux.
  const persistQuizzes = (updatedQuizzes) => {
    try {
      localStorage.setItem("question", JSON.stringify(updatedQuizzes));

      // Update Redux only after localStorage saves successfully.
      dispatch(setQuizzes(updatedQuizzes));

      setStorageError("");
      return true;
    } catch (error) {
      console.error("Unable to save quizzes:", error);
      setStorageError("Unable to save changes. Please try again.");
      return false;
    }
  };

  // Change a quiz's Active/Inactive status.
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

  // Cancel deletion.
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

    if (persistQuizzes(updatedQuizzes)) {
      setDeleteDialogOpen(false);
      setSelectedQuiz(null);
    }
  };

  // Open the edit dialog with the selected quiz's data.
  const handleEditClick = (quiz) => {
    setEditingQuizId(quiz.id);
    setEditTitle(quiz.quizTitle || "");

    setEditQuestions(
      (quiz.questions || []).map((item) => ({
        question: item.question || "",
        options: Array.isArray(item.options) ? [...item.options] : ["", ""],
        correctAnswer: item.correctAnswer ?? "",
      }))
    );

    setEditError("");
    setEditDialogOpen(true);
  };

  // Close the edit dialog.
  const handleCloseEdit = () => {
    setEditDialogOpen(false);
    setEditingQuizId(null);
    setEditError("");
  };

  // Update question text or correct answer.
  const handleQuestionChange = (questionIndex, field, value) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) =>
        index === questionIndex ? { ...item, [field]: value } : item
      )
    );

    setEditError("");
  };

  // Update an option.
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) => {
        if (index !== questionIndex) return item;

        const updatedOptions = [...item.options];
        updatedOptions[optionIndex] = value;

        return { ...item, options: updatedOptions };
      })
    );

    setEditError("");
  };

  // Add an option.
  const handleAddOption = (questionIndex) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) =>
        index === questionIndex
          ? { ...item, options: [...item.options, ""] }
          : item
      )
    );
  };

  // Remove an option and adjust the correct-answer index.
  const handleRemoveOption = (questionIndex, optionIndex) => {
    setEditQuestions((previousQuestions) =>
      previousQuestions.map((item, index) => {
        if (index !== questionIndex) return item;

        // Keep at least two options.
        if (item.options.length <= 2) return item;

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

    setEditError("");
  };

  // Add a blank question.
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

  // Remove a question.
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

    // Require at least 10 questions.
    if (editQuestions.length < 10) {
      setEditError("A quiz must contain at least 10 questions.");
      return;
    }

    for (let i = 0; i < editQuestions.length; i++) {
      const item = editQuestions[i];
      const trimmedQuestion = item.question.trim();

      if (trimmedQuestion.length < 10 || trimmedQuestion.length > 200) {
        setEditError(
          `Question ${i + 1} must be between 10 and 200 characters.`
        );
        return;
      }

      const validOptions = item.options.filter(
        (option) => option.trim() !== ""
      );

      if (validOptions.length < 2) {
        setEditError(
          `Question ${i + 1} must have at least two non-empty options.`
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

    if (persistQuizzes(updatedQuizzes)) {
      handleCloseEdit();
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

        {storageError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {storageError}
          </Alert>
        )}

        {loadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loadError}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Quiz Title</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Questions</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
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

                      <TableCell>
                        {quiz.questions?.length ?? 0}
                      </TableCell>

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
                                handleStatusChange(
                                  quiz.id,
                                  event.target.value
                                )
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
                        <Box sx={{ display: "flex", gap: 1 }}>
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
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
            onChange={(event) => {
              setEditTitle(event.target.value);
              setEditError("");
            }}
            fullWidth
            required
            slotProps={{ htmlInput: { maxLength: 30 } }}
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
                  gap: 1,
                  mb: 2,
                  flexWrap: "wrap",
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
                slotProps={{ htmlInput: { maxLength: 200 } }}
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
            <Alert severity="error" sx={{ mt: 2 }}>
              {editError}
            </Alert>
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
