
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

function Authentication() {
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleStart = (event) => {
    event.preventDefault();

    const trimmedName = fullName.trim();

    if (trimmedName.length < 5 || trimmedName.length > 50) {
      setError("Full name must be between 5 and 50 characters.");
      return;
    }

    navigate("/play-quiz", {
      state: { fullName: trimmedName },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Play?
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Enter your full name to begin your quiz.
          </Typography>

          <Box component="form" onSubmit={handleStart}>
            <TextField
              label="Full Name"
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                setError("");
              }}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
              error={Boolean(error)}
              helperText={
                error || `${fullName.trim().length}/50 characters`
              }
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
            >
              Start Quiz
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Authentication;
