import "./RankRow.css";

const RankRow = ({ rank, position }) => {
  const user = rank.userId;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <tr className={`rank-row ${position <= 3 ? "rank-row--top" : ""}`}>
      <td className="rank-pos">
        {position <= 3 ? medals[position - 1] : position}
      </td>
      <td className="rank-user">
        <div className="rank-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            user?.username?.charAt(0)?.toUpperCase() || "?"
          )}
        </div>
        <span className="rank-username">
          {user?.username || "Unknown"}
          {user?.isPremium && <span className="rank-premium">★</span>}
        </span>
      </td>
      <td className="rank-country">{user?.country || "—"}</td>
      <td className="rank-stat rank-wins">{rank.wins}</td>
      <td className="rank-stat">{rank.losses}</td>
      <td className="rank-stat">{rank.draws}</td>
      <td className="rank-stat">{rank.totalGames}</td>
      <td className="rank-stat">{rank.winRate}%</td>
    </tr>
  );
};

export default RankRow;