import { useEffect, useState } from "react";

import Board from "./components/Board";
import GameStatus from "./components/GameStatus";
import GameControls from "./components/GameControls";
import MoveHistory from "./components/MoveHistory";
import Scoreboard from "./components/Scoreboard";

import {
  createEmptyBoard,
  checkWinner,
  checkDraw,
} from "./utils/gameUtils";

import { getComputerMove } from "./utils/computerUtils";

import "./App.css";

const STORAGE_KEY = "tic-tac-toe-game";

const INITIAL_SCORES = {
  xWins: 0,
  oWins: 0,
  draws: 0,
};

const GAME_MODES = {
  TWO_PLAYER: "two-player",
  COMPUTER: "computer",
};


const createInitialGameState = () => ({
  board: createEmptyBoard(),
  currentPlayer: "X",
  winner: null,
  winningCells: [],
  isDraw: false,
  history: [],
  gameMode: GAME_MODES.TWO_PLAYER,
  scores: { ...INITIAL_SCORES },
});


const loadGameState = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return createInitialGameState();
    }

    const parsedState = JSON.parse(savedState);

    const initialState = createInitialGameState();

    return {
      ...initialState,
      ...parsedState,

      board:
        Array.isArray(parsedState.board) &&
        parsedState.board.length === 9
          ? parsedState.board
          : createEmptyBoard(),

      history: Array.isArray(parsedState.history)
        ? parsedState.history
        : [],

      winningCells: Array.isArray(parsedState.winningCells)
        ? parsedState.winningCells
        : [],

      scores: {
        ...INITIAL_SCORES,
        ...(parsedState.scores || {}),
      },
    };
  } catch (error) {
    console.error("Unable to load saved game:", error);

    return createInitialGameState();
  }
};


const createMove = (position, player, moveNumber) => ({
  moveNumber,
  player,
  position,
  row: Math.floor(position / 3) + 1,
  column: (position % 3) + 1,
});


function App() {
  // Load saved game once
  const [initialState] = useState(loadGameState);

  // Game state
  const [board, setBoard] = useState(initialState.board);

  const [currentPlayer, setCurrentPlayer] = useState(
    initialState.currentPlayer
  );

  const [winner, setWinner] = useState(initialState.winner);

  const [winningCells, setWinningCells] = useState(
    initialState.winningCells
  );

  const [isDraw, setIsDraw] = useState(initialState.isDraw);

  const [history, setHistory] = useState(initialState.history);

  const [gameMode, setGameMode] = useState(initialState.gameMode);

  const [scores, setScores] = useState(initialState.scores);

  // --------------------------------------------------
  // SAVE GAME TO LOCAL STORAGE
  // --------------------------------------------------

  useEffect(() => {
    const gameState = {
      board,
      currentPlayer,
      winner,
      winningCells,
      isDraw,
      history,
      gameMode,
      scores,
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(gameState)
      );
    } catch (error) {
      console.error("Unable to save game:", error);
    }
  }, [
    board,
    currentPlayer,
    winner,
    winningCells,
    isDraw,
    history,
    gameMode,
    scores,
  ]);

  // --------------------------------------------------
  // CHECK GAME RESULT
  // --------------------------------------------------

  const getGameResult = (updatedBoard) => {
    const result = checkWinner(updatedBoard);

    if (result.winner) {
      return {
        winner: result.winner,
        winningCells: result.winningCells,
        isDraw: false,
      };
    }

    if (checkDraw(updatedBoard)) {
      return {
        winner: null,
        winningCells: [],
        isDraw: true,
      };
    }

    return {
      winner: null,
      winningCells: [],
      isDraw: false,
    };
  };

  // --------------------------------------------------
  // UPDATE GAME RESULT AND SCORE
  // --------------------------------------------------

  const updateGameResult = (result) => {
    setWinner(result.winner);
    setWinningCells(result.winningCells);
    setIsDraw(result.isDraw);

    if (result.winner === "X") {
      setScores((previousScores) => ({
        ...previousScores,
        xWins: previousScores.xWins + 1,
      }));

      return;
    }

    if (result.winner === "O") {
      setScores((previousScores) => ({
        ...previousScores,
        oWins: previousScores.oWins + 1,
      }));

      return;
    }

    if (result.isDraw) {
      setScores((previousScores) => ({
        ...previousScores,
        draws: previousScores.draws + 1,
      }));
    }
  };



  const handleCellClick = (position) => {
    // Validate position
    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position > 8
    ) {
      return;
    }

    
    if (winner || isDraw) {
      return;
    }

   
    if (
      gameMode === GAME_MODES.COMPUTER &&
      currentPlayer !== "X"
    ) {
      return;
    }

    if (board[position] !== "") {
      return;
    }

    const player = currentPlayer;

    const updatedBoard = [...board];

    updatedBoard[position] = player;

    const updatedHistory = [
      ...history,
      createMove(
        position,
        player,
        history.length + 1
      ),
    ];

    const playerResult = getGameResult(updatedBoard);

    setBoard(updatedBoard);
    setHistory(updatedHistory);

    if (playerResult.winner || playerResult.isDraw) {
      updateGameResult(playerResult);
      return;
    }

    // TWO PLAYER MODE

    if (gameMode === GAME_MODES.TWO_PLAYER) {
      setCurrentPlayer(player === "X" ? "O" : "X");
      return;
    }

    // COMPUTER MODE

    // Computer receives the updated board
    const computerPosition = getComputerMove(updatedBoard);

    // Validate computer move
    if (
      computerPosition === null ||
      !Number.isInteger(computerPosition) ||
      computerPosition < 0 ||
      computerPosition > 8 ||
      updatedBoard[computerPosition] !== ""
    ) {
      return;
    }

    const computerBoard = [...updatedBoard];

    computerBoard[computerPosition] = "O";

    const computerHistory = [
      ...updatedHistory,
      createMove(
        computerPosition,
        "O",
        updatedHistory.length + 1
      ),
    ];

    const computerResult = getGameResult(computerBoard);

    setBoard(computerBoard);
    setHistory(computerHistory);

    if (computerResult.winner || computerResult.isDraw) {
      updateGameResult(computerResult);
      return;
    }

    setCurrentPlayer("X");
  };

  // UNDO

  const handleUndo = () => {
    if (history.length === 0) {
      return;
    }

    let movesToUndo = 1;

    if (gameMode === GAME_MODES.COMPUTER) {
      const lastMove = history[history.length - 1];

      if (lastMove.player === "O") {
        const previousMove = history[history.length - 2];

        movesToUndo =
          previousMove?.player === "X" ? 2 : 1;
      }
    }

    // Get remaining history
    const remainingHistory = history.slice(
      0,
      history.length - movesToUndo
    );

    // Rebuild board from remaining history
    const updatedBoard = createEmptyBoard();

    remainingHistory.forEach((move) => {
      updatedBoard[move.position] = move.player;
    });

    // Recalculate game result
    const result = getGameResult(updatedBoard);

    // Reverse previous completed result
    if (winner === "X") {
      setScores((previousScores) => ({
        ...previousScores,
        xWins: Math.max(
          0,
          previousScores.xWins - 1
        ),
      }));
    } else if (winner === "O") {
      setScores((previousScores) => ({
        ...previousScores,
        oWins: Math.max(
          0,
          previousScores.oWins - 1
        ),
      }));
    } else if (isDraw) {
      setScores((previousScores) => ({
        ...previousScores,
        draws: Math.max(
          0,
          previousScores.draws - 1
        ),
      }));
    }

    // Restore board and history
    setBoard(updatedBoard);
    setHistory(remainingHistory);

    // Restore result
    setWinner(result.winner);
    setWinningCells(result.winningCells);
    setIsDraw(result.isDraw);

    // Restore player turn
    if (gameMode === GAME_MODES.COMPUTER) {
      setCurrentPlayer("X");
    } else {
      setCurrentPlayer(
        remainingHistory.length % 2 === 0 ? "X" : "O"
      );
    }
  };

  // RESET GAME

  const handleReset = () => {
    // Clear current game
    setBoard(createEmptyBoard());

    setCurrentPlayer("X");

    setWinner(null);

    setWinningCells([]);

    setIsDraw(false);

    setHistory([]);

    // Scoreboard and game mode remain unchanged
  };

  // RESET SCOREBOARD

  const handleResetScores = () => {
    setScores({ ...INITIAL_SCORES });
  };

  // CHANGE GAME MODE

  const handleGameModeChange = (event) => {
    const selectedMode = event.target.value;

    // Validate selected mode
    if (
      selectedMode !== GAME_MODES.TWO_PLAYER &&
      selectedMode !== GAME_MODES.COMPUTER
    ) {
      return;
    }

    // Update mode
    setGameMode(selectedMode);

    // Start a fresh game
    setBoard(createEmptyBoard());

    setCurrentPlayer("X");

    setWinner(null);

    setWinningCells([]);

    setIsDraw(false);

    setHistory([]);

  };

  

  return (
    <main className="app">
      <div className="game-container">
        <aside className="intro-panel">
          <span className="eyebrow">✦ THE CLASSIC STRATEGY GAME</span>
          <h1>TIC <span>TAC</span> TOE</h1>
          <p className="intro-lead">Make your move. Think ahead. Claim the win.</p>
          <div className="intro-feature"><span className="feature-icon">✦</span><div><strong>Sharpen your mind</strong><p>Practice strategy and logical thinking with every move.</p></div></div>
          <div className="intro-feature"><span className="feature-icon">♧</span><div><strong>Play your way</strong><p>Challenge the computer or play with a friend.</p></div></div>
          <div className="intro-feature"><span className="feature-icon">★</span><div><strong>Track your progress</strong><p>Keep an eye on wins, draws and every move.</p></div></div>
          <div className="intro-art" aria-hidden="true"><span className="art-x">×</span><span className="art-o">○</span></div>
        </aside>

        <section className="play-panel" aria-label="Tic Tac Toe game">
          <div className="scoreboard-header"><Scoreboard scores={scores} onResetScores={handleResetScores} /></div>
          <header className="game-header"><span className="eyebrow">READY TO PLAY?</span><h2>Game Arena</h2><p>Three in a row takes the crown.</p></header>
          <section className="game-mode"><label htmlFor="gameMode">Game mode</label><select id="gameMode" value={gameMode} onChange={handleGameModeChange}><option value={GAME_MODES.TWO_PLAYER}>Two Players</option><option value={GAME_MODES.COMPUTER}>Play Against Computer</option></select></section>
          <GameStatus currentPlayer={currentPlayer} winner={winner} isDraw={isDraw} gameMode={gameMode} />
          <Board board={board} onCellClick={handleCellClick} winningCells={winningCells} />
          <GameControls onUndo={handleUndo} onReset={handleReset} canUndo={history.length > 0} />
          <footer className="game-footer"><p>{gameMode === GAME_MODES.COMPUTER ? "You are X · Computer is O" : "X and O take turns"}</p></footer>
        </section>

        <aside className="info-panel">
          <section className="info-card"><h2><span className="section-icon">?</span> How to play</h2><ol className="steps"><li>Choose your game mode.</li><li>Click an empty square to place X or O.</li><li>Get three marks in a row, column or diagonal to win.</li><li>Use Undo to take back a move or Reset to play again.</li></ol></section>
          <section className="info-card"><h2><span className="section-icon">◎</span> Game modes</h2><button type="button" className={`mode-option ${gameMode === GAME_MODES.TWO_PLAYER ? "active" : ""}`} onClick={() => handleGameModeChange({target:{value:GAME_MODES.TWO_PLAYER}})}><span>♧</span><span><strong>Play with a friend</strong><small>Take turns on the same device</small></span><span className="mode-check">{gameMode === GAME_MODES.TWO_PLAYER ? "✓" : "›"}</span></button><button type="button" className={`mode-option ${gameMode === GAME_MODES.COMPUTER ? "active" : ""}`} onClick={() => handleGameModeChange({target:{value:GAME_MODES.COMPUTER}})}><span>▣</span><span><strong>Challenge the computer</strong><small>Test your strategy against AI</small></span><span className="mode-check">{gameMode === GAME_MODES.COMPUTER ? "✓" : "›"}</span></button></section>
          <div className="game-dashboard"><MoveHistory history={history} /></div>
          <section className="tip-card"><span className="eyebrow">PRO TIP</span><h2>Own the center.</h2><p>Controlling the middle square opens more paths to victory.</p><span className="tip-decoration" aria-hidden="true">× ○</span></section>
        </aside>
      </div>
    </main>
  );
}

export default App;
