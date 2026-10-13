
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    // Display the main navigation bar at the top of the application.
    <AppBar position="static">
      <Toolbar>
        {/* Clicking the application title navigates to the home page. */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Quiz Platform
        </Typography>

        {/* Group navigation links together with consistent spacing. */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Navigate to the home page. */}
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {/* Open the page for viewing and managing saved quizzes. */}
          <Button color="inherit" component={Link} to="/my-quizzes">
            My Quiz
          </Button>

          {/* Open the quiz-playing page. */}
          <Button color="inherit" component={Link} to="/play-quiz">
            Play Quiz
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
