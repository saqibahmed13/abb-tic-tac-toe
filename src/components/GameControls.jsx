
function GameControls({
  onUndo,
  onReset,
  canUndo,
}) {
  return (
    <div className="game-controls">
      <button
        onClick={onUndo}
        disabled={!canUndo}
      >
        Undo
      </button>

      <button onClick={onReset}>
        Reset Game
      </button>
    </div>
  );
}

export default GameControls;
