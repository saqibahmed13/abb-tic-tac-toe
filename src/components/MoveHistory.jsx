
function MoveHistory({ history }) {
  return (
    <div className="move-history">
      <h2>Move History</h2>

      {history.length === 0 ? (
        <p>No moves yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Move</th>
              <th>Player</th>
              <th>Row</th>
              <th>Column</th>
            </tr>
          </thead>

          <tbody>
            {history.map((move) => (
              <tr key={move.moveNumber}>
                <td>{move.moveNumber}</td>
                <td>{move.player}</td>
                <td>{move.row}</td>
                <td>{move.column}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MoveHistory;
