import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  // Read the current route and its navigation state.
  const location = useLocation();

  // Retrieve the participant's name from navigation state or session storage.
  const fullName =
    location.state?.fullName ||
    sessionStorage.getItem("participantName") ||
    "";

  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: "wrap", gap: 1 }}>
        {/* Application title links back to the home page. */}
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

        {/* Navigation links for the main application pages. */}
        <Box sx={{ display: "flex", gap: { xs: 0, sm: 1 } }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          <Button color="inherit" component={Link} to="/my-quizzes">
            My Quiz
          </Button>

          <Button color="inherit" component={Link} to="/play-quiz">
            Play Quiz
          </Button>
        </Box>

        {/* Display the participant's name after they start a quiz. */}
        {fullName && (
          <Typography
            variant="body2"
            sx={{
              ml: { xs: 0, sm: 2 },
              width: { xs: "100%", sm: "auto" },
              textAlign: { xs: "center", sm: "right" },
              fontWeight: "medium",
              overflowWrap: "anywhere",
            }}
          >
            Participant: {fullName}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
