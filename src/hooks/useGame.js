
import { useEffect, useState } from "react";

import {
  createEmptyBoard,
  checkWinner,
  checkDraw,
} from "../utils/gameUtils";

import { getComputerMove } from "../utils/computerUtils";

const STORAGE_KEY = "tic-tac-toe-game";

export const GAME_MODES = {
  TWO_PLAYER: "two-player",
  COMPUTER: "computer",
};

const INITIAL_SCORES = {
  xWins: 0,
  oWins: 0,
  draws: 0,
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

// Safely load the saved game.
const loadGameState = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return createInitialGameState();
    }

    const parsedState = JSON.parse(savedState);

    if (!parsedState || typeof parsedState !== "object") {
      return createInitialGameState();
    }

    const initialState = createInitialGameState();

    const validBoard =
      Array.isArray(parsedState.board) &&
      parsedState.board.length === 9 &&
      parsedState.board.every(
        (cell) => cell === "" || cell === "X" || cell === "O"
      );

    const validHistory =
      Array.isArray(parsedState.history) &&
      parsedState.history.every(
        (move) =>
          move &&
          (move.player === "X" || move.player === "O") &&
          Number.isInteger(move.position) &&
          move.position >= 0 &&
          move.position <= 8
      );

    const validMode =
      parsedState.gameMode === GAME_MODES.TWO_PLAYER ||
      parsedState.gameMode === GAME_MODES.COMPUTER;

    const savedScores = parsedState.scores || {};

    const validScore = (value) =>
      Number.isInteger(value) && value >= 0;

    return {
      ...initialState,
      board: validBoard ? parsedState.board : initialState.board,
      history: validHistory ? parsedState.history : [],
      gameMode: validMode
        ? parsedState.gameMode
        : GAME_MODES.TWO_PLAYER,
      currentPlayer:
        parsedState.currentPlayer === "O" ? "O" : "X",
      winner:
        parsedState.winner === "X" || parsedState.winner === "O"
          ? parsedState.winner
          : null,
      winningCells: Array.isArray(parsedState.winningCells)
        ? parsedState.winningCells
        : [],
      isDraw: Boolean(parsedState.isDraw),
      scores: {
        xWins: validScore(savedScores.xWins)
          ? savedScores.xWins
          : 0,
        oWins: validScore(savedScores.oWins)
          ? savedScores.oWins
          : 0,
        draws: validScore(savedScores.draws)
          ? savedScores.draws
          : 0,
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

const getGameResult = (board) => {
  const result = checkWinner(board);

  if (result.winner) {
    return {
      winner: result.winner,
      winningCells: result.winningCells,
      isDraw: false,
    };
  }

  if (checkDraw(board)) {
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

const getNextPlayer = (history) =>
  history.length % 2 === 0 ? "X" : "O";

const rebuildBoard = (history) => {
  const board = createEmptyBoard();

  history.forEach((move) => {
    board[move.position] = move.player;
  });

  return board;
};

export default function useGame() {
  const [initialState] = useState(loadGameState);

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

  // Save game whenever state changes.
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

  // Apply a valid move and update the game result.
  const applyMove = (position, player) => {
    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position > 8 ||
      winner ||
      isDraw ||
      board[position] !== "" ||
      player !== currentPlayer
    ) {
      return false;
    }

    const updatedBoard = [...board];
    updatedBoard[position] = player;

    const updatedHistory = [
      ...history,
      createMove(position, player, history.length + 1),
    ];

    const result = getGameResult(updatedBoard);

    setBoard(updatedBoard);
    setHistory(updatedHistory);

    if (result.winner) {
      setWinner(result.winner);
      setWinningCells(result.winningCells);
      setIsDraw(false);

      setScores((previousScores) => ({
        ...previousScores,
        [result.winner === "X" ? "xWins" : "oWins"]:
          previousScores[
            result.winner === "X" ? "xWins" : "oWins"
          ] + 1,
      }));

      return true;
    }

    if (result.isDraw) {
      setWinner(null);
      setWinningCells([]);
      setIsDraw(true);

      setScores((previousScores) => ({
        ...previousScores,
        draws: previousScores.draws + 1,
      }));

      return true;
    }

    setCurrentPlayer(player === "X" ? "O" : "X");

    return true;
  };

  // Handle a human move.
  const handleCellClick = (position) => {
    if (winner || isDraw) return;

    // In computer mode, the human always plays X.
    if (
      gameMode === GAME_MODES.COMPUTER &&
      currentPlayer !== "X"
    ) {
      return;
    }

    const player = currentPlayer;

    // Validate the move before making it.
    if (
      !Number.isInteger(position) ||
      position < 0 ||
      position > 8 ||
      board[position] !== ""
    ) {
      return;
    }

    const humanBoard = [...board];
    humanBoard[position] = player;

    const humanResult = getGameResult(humanBoard);

    const humanMove = createMove(
      position,
      player,
      history.length + 1
    );

    const humanHistory = [...history, humanMove];

    // Human move wins or draws.
    if (humanResult.winner || humanResult.isDraw) {
      setBoard(humanBoard);
      setHistory(humanHistory);
      setWinner(humanResult.winner);
      setWinningCells(humanResult.winningCells);
      setIsDraw(humanResult.isDraw);

      if (humanResult.winner) {
        setScores((previousScores) => ({
          ...previousScores,
          xWins: previousScores.xWins + 1,
        }));
      } else {
        setScores((previousScores) => ({
          ...previousScores,
          draws: previousScores.draws + 1,
        }));
      }

      return;
    }

    // Two-player mode: alternate turns.
    if (gameMode === GAME_MODES.TWO_PLAYER) {
      setBoard(humanBoard);
      setHistory(humanHistory);
      setCurrentPlayer(player === "X" ? "O" : "X");
      return;
    }

    // Computer mode: calculate O's move using the updated board.
    const computerPosition = getComputerMove(humanBoard);

    if (
      computerPosition === null ||
      !Number.isInteger(computerPosition) ||
      computerPosition < 0 ||
      computerPosition > 8 ||
      humanBoard[computerPosition] !== ""
    ) {
      // Keep the valid human move if no computer move is available.
      setBoard(humanBoard);
      setHistory(humanHistory);
      setCurrentPlayer("X");
      return;
    }

    const computerBoard = [...humanBoard];
    computerBoard[computerPosition] = "O";

    const computerMove = createMove(
      computerPosition,
      "O",
      humanHistory.length + 1
    );

    const computerHistory = [
      ...humanHistory,
      computerMove,
    ];

    const computerResult = getGameResult(computerBoard);

    setBoard(computerBoard);
    setHistory(computerHistory);

    if (computerResult.winner) {
      setWinner(computerResult.winner);
      setWinningCells(computerResult.winningCells);
      setIsDraw(false);

      setScores((previousScores) => ({
        ...previousScores,
        oWins: previousScores.oWins + 1,
      }));

      return;
    }

    if (computerResult.isDraw) {
      setWinner(null);
      setWinningCells([]);
      setIsDraw(true);

      setScores((previousScores) => ({
        ...previousScores,
        draws: previousScores.draws + 1,
      }));

      return;
    }

    // Human plays X again.
    setCurrentPlayer("X");
  };

  // Undo the most recent move.
  const handleUndo = () => {
    if (history.length === 0) return;

    let movesToUndo = 1;

    // Computer mode: undo O and the preceding X together.
    // If the last move is X, undo only X.
    if (gameMode === GAME_MODES.COMPUTER) {
      const lastMove = history[history.length - 1];

      if (lastMove.player === "O") {
        movesToUndo = Math.min(2, history.length);
      }
    }

    const remainingHistory = history.slice(
      0,
      history.length - movesToUndo
    );

    const updatedBoard = rebuildBoard(remainingHistory);
    const result = getGameResult(updatedBoard);

    // Reverse the score if the undone game had finished.
    if (winner) {
      const scoreKey = winner === "X" ? "xWins" : "oWins";

      setScores((previousScores) => ({
        ...previousScores,
        [scoreKey]: Math.max(
          0,
          previousScores[scoreKey] - 1
        ),
      }));
    } else if (isDraw) {
      setScores((previousScores) => ({
        ...previousScores,
        draws: Math.max(0, previousScores.draws - 1),
      }));
    }

    setBoard(updatedBoard);
    setHistory(remainingHistory);
    setWinner(result.winner);
    setWinningCells(result.winningCells);
    setIsDraw(result.isDraw);

    // Restore the turn.
    if (gameMode === GAME_MODES.COMPUTER) {
      setCurrentPlayer("X");
    } else {
      setCurrentPlayer(getNextPlayer(remainingHistory));
    }
  };

  // Reset the current game but preserve the scoreboard.
  const handleReset = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
    setHistory([]);
  };

  // Reset only the scoreboard.
  const handleResetScores = () => {
    setScores({ ...INITIAL_SCORES });
  };

  // Change game mode and start a fresh game.
  const handleGameModeChange = (event) => {
    const selectedMode = event.target.value;

    if (
      selectedMode !== GAME_MODES.TWO_PLAYER &&
      selectedMode !== GAME_MODES.COMPUTER
    ) {
      return;
    }

    setGameMode(selectedMode);

    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
    setHistory([]);
  };

  return {
    board,
    currentPlayer,
    winner,
    winningCells,
    isDraw,
    history,
    gameMode,
    scores,

    handleCellClick,
    handleUndo,
    handleReset,
    handleResetScores,
    handleGameModeChange,

    canUndo: history.length > 0,
  };
}
