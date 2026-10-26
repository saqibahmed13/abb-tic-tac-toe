
function Cell({
  value,
  onClick,
  isWinningCell,
  disabled,
}) {
  return (
    <button
      className={`cell ${isWinningCell ? "winning-cell" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

export default Cell;
