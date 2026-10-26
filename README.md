# Tic Tac Toe

## 1. Project Overview

Tic Tac Toe is a browser-based game developed using React. It allows users to play against another player on the same device or challenge the computer.

The application provides an interactive 3×3 game board, game status updates, move history, undo functionality, scoreboard tracking, and game state persistence using browser localStorage.

The project demonstrates React component-based architecture, state management, reusable utility functions, and responsive UI design.

## 2. Tech Stack

### Frontend
- React
- JavaScript
- Vite
- HTML5
- CSS3

### State Management
- React `useState`
- React `useEffect`

### Persistence
- Browser localStorage

### Development Tools
- Node.js
- npm
- Git
- GitHub

### Backend
- Not applicable. The current application uses a frontend-only architecture.

## 3. Features Implemented

- Two-player mode
- Play against computer mode
- Interactive 3×3 game board
- Player turn tracking
- Invalid move prevention
- Winner detection
- Draw detection
- Winning cell highlighting
- Computer move selection
- Computer winning move detection
- Computer blocking strategy
- Move history with player, row, and column details
- Undo functionality
- Reset game functionality
- Scoreboard for X wins, O wins, and draws
- Reset scoreboard functionality
- Game mode selection
- Game state persistence using localStorage
- Restore saved game state when the application reloads
- Responsive user interface
- Light purple dashboard design

## 4. Project Structure

```text
tic-tac-toe/
├── public/
├── src/
│   ├── components/
│   │   ├── Board.jsx
│   │   ├── GameStatus.jsx
│   │   ├── GameControls.jsx
│   │   ├── Scoreboard.jsx
│   │   └── MoveHistory.jsx
│   │
│   ├── utils/
│   │   ├── gameUtils.js
│   │   └── computerUtils.js
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## 5. How to Run the Frontend Locally

### Prerequisites

Install the following:

- Node.js
- npm

### Step 1: Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Navigate to the project directory

```bash
cd tic-tac-toe
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Start the development server

```bash
npm run dev
```

### Step 5: Open the application

Open the local URL displayed in the terminal.

For a typical Vite configuration:

```text
http://localhost:5173
```

The development server may use a different port if the default port is unavailable.

## 6. How to Run the Backend Locally

A separate backend is not required for the current implementation.

The game logic runs in the React frontend, and game state persistence uses browser localStorage.

There are currently no backend services to install or start.

## 7. API Endpoint Summary

The current application does not use a backend API.

| Endpoint | Description |
|---|---|
| Not applicable | Game logic is handled locally in the frontend |
| Not applicable | Game state is stored in browser localStorage |

No REST API endpoints are currently implemented.

## 8. How to Run Tests

The application requirements include testing game functionality such as:

- Two-player mode
- Computer mode
- Alternating turns
- Invalid move handling
- Winner detection
- Draw detection
- Winning cell highlighting
- Move history
- Undo functionality
- Scoreboard
- Reset game
- Reset scoreboard

A dedicated automated testing framework and test scripts have not yet been confirmed in the current project.

Once automated tests are configured, document the actual test command here.

For example, if Vitest is configured:

```bash
npm test
```

Do not use this command until the corresponding test script exists in package.json.

## 9. AI Tools and Prompt Summary

AI assistance was used during development to support:

- Understanding the project requirements
- Reviewing React component structure
- Improving game logic organization
- Identifying potential state management issues
- Improving the UI layout and styling
- Preparing project documentation
- Understanding implementation decisions

AI-assisted development focused on improving code readability, maintainability, and the overall user experience.

The final implementation and functionality should be reviewed and understood by the developer.

## 10. Design Decisions

### Component-Based Architecture

The application is divided into reusable React components.

- `App.jsx`: Main application state and game flow
- `Board.jsx`: Displays the game board
- `GameStatus.jsx`: Displays the current turn and game result
- `GameControls.jsx`: Handles undo and reset controls
- `Scoreboard.jsx`: Displays game scores
- `MoveHistory.jsx`: Displays previous moves

This separation improves readability and makes individual UI components easier to maintain.

### Game Logic Separation

Game-related utility functions are maintained separately from UI components.

`gameUtils.js` handles:

- Empty board creation
- Winning combination detection
- Winner detection
- Draw detection

`computerUtils.js` handles:

- Available move selection
- Winning move detection
- Blocking opponent moves
- Computer move selection

### React State Management

React state is used to manage the board, current player, game result, move history, game mode, and scores.

State updates trigger React re-rendering to keep the interface synchronized with the game.

### Local Storage Persistence

Browser localStorage is used to persist the game state across page reloads.

This avoids requiring a backend or database for the current application.

### Responsive UI

CSS Grid and responsive CSS rules are used to organize the game interface and dashboard.

The application uses a light purple visual theme with cards, spacing, and responsive layouts.

## 11. Clarifications and Assumptions

- The application is a frontend-only game.
- The game supports two-player mode and computer mode.
- X is the first player.
- The computer plays as O in computer mode.
- Players take turns placing marks in empty cells.
- A player wins by placing three marks in a horizontal, vertical, or diagonal combination.
- A draw occurs when all cells are occupied and no winner exists.
- The computer uses a rule-based move selection strategy.
- Game state persistence is handled through browser localStorage.
- No authentication or user accounts are required.
- No backend API or database is required.
- The application is intended to run in a modern web browser.

## 12. Known Limitations

- The computer uses a rule-based strategy and is not an unbeatable AI.
- Game state is stored locally in the browser.
- Game scores are not synchronized across different browsers or devices.
- There is no backend database.
- There is no multiplayer functionality over a network.
- Automated test coverage has not yet been confirmed.
- Game state persistence depends on browser localStorage availability.

## 13. Future Improvements

- Implement automated unit tests for game logic.
- Add integration tests for React components.
- Improve computer strategy using the minimax algorithm.
- Add online multiplayer functionality.
- Introduce backend APIs and database persistence.
- Add player profiles and game statistics.
- Improve accessibility and keyboard navigation.
- Add additional themes and customization options.
- Add deployment and production build documentation.

## 14. License

This project was developed as part of a technical assignment.

A formal open-source license has not been added.
