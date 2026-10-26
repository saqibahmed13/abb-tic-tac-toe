
function GameStatus({
  currentPlayer,
  winner,
  isDraw,
  gameMode,
}) {
  const getStatusMessage = () => {
    if (winner) {
      return `Winner: ${winner}`;
    }

    if (isDraw) {
      return "Game Draw!";
    }

    if (gameMode === "computer") {
      return currentPlayer === "X"
        ? "Your turn: X"
        : "Computer is playing...";
    }

    return `Current Player: ${currentPlayer}`;
  };

  return (
    <div className="game-status">
      <p>{getStatusMessage()}</p>
    </div>
  );
}

export default GameStatus;
