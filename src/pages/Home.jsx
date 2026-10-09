
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  const cards = [
    {
      title: "Create New Quiz",
      description: "Create and save your quiz questions.",
      buttonText: "Create Quiz",
      path: "/create-quiz",
      icon: "＋",
    },
    {
      title: "My Quizzes",
      description: "View and manage your saved questions.",
      buttonText: "View Quizzes",
      path: "/my-quizzes",
      icon: "▤",
    },
    {
      title: "Play Quiz",
      description: "Test your knowledge with a quiz.",
      buttonText: "Start Quiz",
      path: "/authentication",
      icon: "▶",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Quiz Platform
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Create quizzes, manage questions, and test your knowledge.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
          pb: 5,
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.title}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{ mb: 2, color: "primary.main" }}
              >
                {card.icon}
              </Typography>

              <Typography variant="h5" component="h2" gutterBottom>
                {card.title}
              </Typography>

              <Typography color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to={card.path}
              >
                {card.buttonText}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default Home;
