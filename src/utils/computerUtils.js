
import { checkWinner } from "./gameUtils";

export const getAvailableMoves = (board) => {
  return board
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);
};

// Check whether a player can win in one move
export const findWinningMove = (board, player) => {
  const availableMoves = getAvailableMoves(board);

  for (const index of availableMoves) {
    const updatedBoard = [...board];

    updatedBoard[index] = player;

    const result = checkWinner(updatedBoard);

    if (result.winner === player) {
      return index;
    }
  }

  return null;
};

// Computer selects its next move
export const getComputerMove = (board) => {
  // 1. Check if computer can win
  const winningMove = findWinningMove(board, "O");

  if (winningMove !== null) {
    return winningMove;
  }

  // 2. Block human from winning
  const blockingMove = findWinningMove(board, "X");

  if (blockingMove !== null) {
    return blockingMove;
  }

  // 3. Take center
  if (board[4] === "") {
    return 4;
  }

  // 4. Take an available corner
  const corners = [0, 2, 6, 8];

  for (const corner of corners) {
    if (board[corner] === "") {
      return corner;
    }
  }

  // 5. Take any available cell
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length > 0) {
    return availableMoves[0];
  }

  return null;
};
