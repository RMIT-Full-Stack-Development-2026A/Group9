import { useLeaderboard } from "./Leaderboard.hook.js";
import RankRow from "./components/RankRow/RankRow.jsx";
import "./Leaderboard.css";

const SORT_OPTIONS = [
  { value: "wins", label: "Wins" },
  { value: "winRate", label: "Win Rate" },
  { value: "totalGames", label: "Total Games" },
];

const Leaderboard = () => {
  const { ranks, sortBy, setSortBy, loading, myRank } = useLeaderboard();

  return (
    <div className="leaderboard-page">
      <h2 className="leaderboard-title">Leaderboard</h2>

      {myRank && (
        <div className="my-rank-card">
          <h4>Your Stats</h4>
          <div className="my-rank-stats">
            <div className="my-rank-item">
              <span className="my-rank-value">{myRank.wins}</span>
              <span className="my-rank-label">Wins</span>
            </div>
            <div className="my-rank-item">
              <span className="my-rank-value">{myRank.losses}</span>
              <span className="my-rank-label">Losses</span>
            </div>
            <div className="my-rank-item">
              <span className="my-rank-value">{myRank.draws}</span>
              <span className="my-rank-label">Draws</span>
            </div>
            <div className="my-rank-item">
              <span className="my-rank-value">{myRank.winRate}%</span>
              <span className="my-rank-label">Win Rate</span>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-controls">
        <label>Sort by:</label>
        <div className="sort-options">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`sort-btn ${sortBy === opt.value ? "active" : ""}`}
              onClick={() => setSortBy(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="leaderboard-loading">Loading...</p>
      ) : ranks.length === 0 ? (
        <p className="leaderboard-empty">No rankings yet. Play some games!</p>
      ) : (
        <div className="leaderboard-table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Country</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Draws</th>
                <th>Games</th>
                <th>Win %</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((rank, i) => (
                <RankRow key={rank._id} rank={rank} position={i + 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;