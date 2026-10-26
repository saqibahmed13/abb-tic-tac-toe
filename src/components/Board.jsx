
import Cell from "./Cell";

function Board({ board, onCellClick, winningCells }) {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinningCell={winningCells.includes(index)}
          disabled={value !== ""}
        />
      ))}
    </div>
  );
}

export default Board;
