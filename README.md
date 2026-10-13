# Quiz Platform

A responsive quiz application built with React that allows users to create quizzes, manage questions, participate in quizzes, and view their results.

## Project Overview

Quiz Platform is a frontend-focused web application developed to demonstrate React component development, client-side routing, form validation, state management, and browser-based data persistence.

Users can create multiple-choice quizzes, manage existing quizzes, attempt active quizzes, and view their scores after submission.

## Features

### 1. Home Page
- Dashboard with navigation to quiz creation, quiz management, and quiz gameplay.
- Responsive card-based layout.

### 2. Create Quiz
- Create quizzes with a title and multiple-choice questions.
- Add and remove answer options.
- Select the correct answer for each question.
- Add multiple questions to a quiz.
- Validate quiz titles, question text, options, and correct answers.
- Save quiz data in browser `localStorage`.

### 3. My Quizzes
- View saved quizzes in a table.
- Display question counts and creation dates.
- Change quiz status between Active and Inactive.
- Edit quiz titles, questions, options, and correct answers.
- Delete quizzes using a confirmation dialog.

### 4. Participant Authentication
- Enter a participant's full name before starting a quiz.
- Validate the participant's name.
- Pass participant information to the gameplay page.

### 5. Play Quiz
- Select an available Active quiz.
- Display questions with radio-button answer options.
- Require an answer before proceeding to the next question.
- Navigate through questions and submit the quiz.
- Calculate the participant's score.
- Support up to 10 questions per attempt.

### 6. Results Page
- Display the participant's name and quiz title.
- Show the score and percentage.
- Display a performance message.
- Review selected and correct answers.
- Navigate back to Home or start another quiz.

## Technology Stack

**React** — User interface and components
- **Vite** — Development server and build tool
- **JavaScript** — Application logic
- **Material UI (MUI)** — UI components and styling
- **React Router DOM** — Navigation between pages
- **Redux Toolkit** — Redux store and quiz state configuration
- **Redux Thunk** — Asynchronous Redux actions
- **HTML5** — Page structure
- **CSS3** — Styling and responsive layouts
- **localStorage** — Browser-based quiz data storage

## Project Structure

Quiz-Platform/
├── public/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateQuiz.jsx
│   │   ├── MyQuiz.jsx
│   │   ├── Authentication.jsx
│   │   ├── PlayQuiz.jsx
│   │   └── ResultQuiz.jsx
│   ├── redux/
│   │   ├── quizSlice.js
│   │   └── store.js
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── README.md

## Prerequisites

Install the following before running the project:

- Node.js (preferably a supported LTS release)
- npm
- Git (optional, for cloning the repository)

## Installation and Setup

### 1. Clone the repository

git clone https://github.com/UmarCodesTech/Quiz-Platform.git
```

### 2. Open the project directory

cd Quiz-Platform

### 3. Install dependencies

npm install

### 4. Start the development server

npm run dev

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

# Data Storage

The application uses browser `localStorage` to save created quizzes and retain changes across page refreshes.

Because the project uses client-side storage, quiz data is specific to the browser and website origin where it was created. The application does not currently use a backend database or server-side authentication.

## Deployment

The application is deployed using Vercel.

**Live URL:** https://quiz-platform-two-bice.vercel.app/

## Future Improvements

- Add backend integration and database storage.
- Implement secure user authentication.
- Add quiz categories and difficulty levels.
- Introduce a timer for quiz attempts.
- Add automated tests for validation, quiz submission, and scoring.

## Author

**Umar Farooq**

GitHub: https://github.com/UmarCodesTech
