
function Scoreboard({ scores, onResetScores }) {
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>

      <div className="score-cards">
        <div className="score-card">
          <h3>X Wins</h3>
          <p>{scores.xWins}</p>
        </div>

        <div className="score-card">
          <h3>O Wins</h3>
          <p>{scores.oWins}</p>
        </div>

        <div className="score-card">
          <h3>Draws</h3>
          <p>{scores.draws}</p>
        </div>
      </div>

      <button onClick={onResetScores}>
        Reset Scoreboard
      </button>
    </div>
  );
}

export default Scoreboard;
