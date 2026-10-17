
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const fullName =
    location.state?.fullName ||
    sessionStorage.getItem("participantName") ||
    "";

  return (
    <AppBar position="static" sx={{ width: "100%" }}>
      <Toolbar
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr auto 1fr",
          },
          alignItems: "center",
          justifyItems: "center",
          gap: { xs: 1, md: 0 },
          width: "100%",
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1.5, md: 1 },
        }}
      >
        {/* Empty desktop column keeps the title truly centered */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            justifySelf: "start",
          }}
        />

        {/* Application title */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
            letterSpacing: { xs: "0.5px", sm: "1.5px" },
            fontSize: { xs: "1.1rem", sm: "1.4rem" },
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          QUIZ PLATFORM
        </Typography>

        {/* Navigation and participant details */}
        <Box
          sx={{
            gridColumn: { xs: "1", md: "3" },
            justifySelf: { xs: "center", md: "end" },
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0, sm: 0.5 },
            maxWidth: "100%",
          }}
        >
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ minWidth: 0, px: { xs: 0.75, sm: 1.5 } }}
          >
            HOME
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/my-quizzes"
            sx={{ minWidth: 0, px: { xs: 0.75, sm: 1.5 } }}
          >
            MY QUIZ
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/play-quiz"
            sx={{ minWidth: 0, px: { xs: 0.75, sm: 1.5 } }}
          >
            PLAY QUIZ
          </Button>

          {fullName && (
            <Typography
              variant="body2"
              sx={{
                ml: { xs: 0.5, sm: 1.5 },
                mt: { xs: 0.5, sm: 0 },
                textAlign: "center",
                overflowWrap: "anywhere",
              }}
            >
              Participant: {fullName}
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
