
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
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

        <Box sx={{ display: "flex", gap: 1 }}>
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
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
