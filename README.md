Quiz Platform

A responsive quiz application built with React that allows users to create quizzes, manage questions, participate in quizzes, and view their results.

Project Overview

The Quiz Platform is a frontend-focused project developed to demonstrate React component development, client-side routing, form validation, state management, and browser-based data persistence.

Users can create multiple-choice quizzes, manage saved quizzes, attempt active quizzes, and view their scores after submission.

Features

1. Home Page

Dashboard with navigation to quiz creation, quiz management, and quiz gameplay.

Responsive card-based layout.

2. Create Quiz

Create quizzes with a title and multiple-choice questions.

Add and remove answer options.

Select the correct answer.

Add multiple questions to a quiz.

Validate quiz titles, questions, options, and correct answers.

Save quiz data in browser localStorage.

3. My Quizzes

View saved quizzes in a table.

View question counts and creation dates.

Change quiz status between Active and Inactive.

Edit quiz titles, questions, options, and correct answers.

Delete quizzes with a confirmation dialog.

4. Participant Authentication

Enter a participant's full name before starting.

Validate the name length.

Pass participant information to the gameplay page.

5. Play Quiz

Select an available Active quiz.

Display questions with radio-button answer options.

Require an answer before proceeding to the next question.

Support quiz submission and score calculation.

Use up to 10 questions per attempt.

6. Results Page

Display the participant's name and quiz title.

Show the score and percentage.

Display a performance message.

Provide navigation to Home and the quiz entry screen.

Technology Stack

React — UI components and application logic

Vite — Development server and build tool

JavaScript — Application functionality

Material UI (MUI) — UI components and responsive styling

React Router DOM — Client-side navigation

Redux Toolkit — Redux store and quiz slice configuration

Redux Thunk — Asynchronous Redux actions through Redux Toolkit

Browser localStorage — Client-side quiz persistence

HTML and CSS — Application structure and styling

Prerequisites

Install the following before running the project:

Node.js (a current supported LTS release)
npm
Git (optional, for cloning the repository)