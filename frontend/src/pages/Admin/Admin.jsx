import { useAdmin } from "./Admin.hook.js";
import Button from "../../components/Button/Button.jsx";
import "./Admin.css";

const Admin = () => {
  const {
    tab, setTab, players, rooms, searchQuery, setSearchQuery,
    loading, handleToggleStatus, handleCloseRoom, handleSearchRooms,
  } = useAdmin();

  if (loading) return <p className="admin-loading">Loading...</p>;

  return (
    <div className="admin-page">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === "players" ? "active" : ""}`}
          onClick={() => setTab("players")}
        >
          Players ({players.length})
        </button>
        <button
          className={`admin-tab ${tab === "rooms" ? "active" : ""}`}
          onClick={() => setTab("rooms")}
        >
          Game Rooms ({rooms.length})
        </button>
      </div>

      {/* Players Tab */}
      {tab === "players" && (
        <div className="admin-section">
          {players.length === 0 ? (
            <p className="admin-empty">No players found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Role</th>
                  <th>Premium</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p._id}>
                    <td className="admin-user-cell">
                      <div className="admin-avatar">
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.username} />
                        ) : (
                          p.username?.charAt(0)?.toUpperCase() || "?"
                        )}
                      </div>
                      {p.username}
                    </td>
                    <td>{p.email}</td>
                    <td>{p.country || "—"}</td>
                    <td>
                      <span className={`role-badge role-${p.role}`}>{p.role}</span>
                    </td>
                    <td>{p.isPremium ? "★" : "—"}</td>
                    <td>
                      <span className={`status-dot ${p.isActive ? "active" : "inactive"}`} />
                      {p.isActive ? "Active" : "Blocked"}
                    </td>
                    <td>
                      <Button
                        variant={p.isActive ? "danger" : "primary"}
                        size="sm"
                        onClick={() => handleToggleStatus(p._id, p.isActive)}
                      >
                        {p.isActive ? "Block" : "Unblock"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Game Rooms Tab */}
      {tab === "rooms" && (
        <div className="admin-section">
          <div className="admin-search-row">
            <input
              type="text"
              className="admin-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchRooms()}
              placeholder="Search by room number or player..."
            />
            <Button variant="ghost" onClick={handleSearchRooms}>
              Search
            </Button>
          </div>

          {rooms.length === 0 ? (
            <p className="admin-empty">No game rooms found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Board</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r._id}>
                    <td>{r.roomNumber}</td>
                    <td>{r.player1?.username || "—"}</td>
                    <td>{r.player2?.username || "Waiting..."}</td>
                    <td>{r.boardSize}x{r.boardSize}</td>
                    <td>
                      <span className={`room-status room-${r.status}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status !== "closed" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCloseRoom(r._id)}
                        >
                          Close
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
