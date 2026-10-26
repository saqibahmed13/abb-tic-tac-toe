export const createEmptyBoard = () => {
  return Array(9).fill("");
};

export const getWinningCombinations = () => {
  return [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];
};

export const checkWinner = (board) => {
  const winningCombinations = getWinningCombinations();

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        winner: board[a],
        winningCells: combination,
      };
    }
  }

  return {
    winner: null,
    winningCells: [],
  };
};

export const checkDraw = (board) => {
  return board.every((cell) => cell !== "");
};
