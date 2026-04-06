import { useLobby } from "./Lobby.hook.js";
import Button from "../../components/Button/Button.jsx";
import "./Lobby.css";

const MARKERS = ["X", "O", "△", "□", "◇", "★"];

const Lobby = ({ user }) => {
  const lobby = useLobby(user);

  return (
    <div className="lobby-page">
      <h2 className="lobby-title">Online Lobby</h2>

      {/* Create Room */}
      <div className="lobby-create">
        <h3>Create a Room</h3>
        <div className="lobby-create-options">
          <div className="lobby-field">
            <label>Board Size</label>
            <div className="lobby-options">
              {[10, 15].map((s) => (
                <button
                  key={s}
                  className={`lobby-opt ${lobby.boardSize === s ? "active" : ""}`}
                  onClick={() => lobby.setBoardSize(s)}
                >
                  {s}x{s}
                </button>
              ))}
            </div>
          </div>
          <div className="lobby-field">
            <label>Your Marker</label>
            <div className="lobby-options">
              {MARKERS.map((m) => (
                <button
                  key={m}
                  className={`lobby-opt marker ${lobby.marker === m ? "active" : ""}`}
                  onClick={() => lobby.setMarker(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Button variant="primary" onClick={lobby.createRoom} disabled={lobby.creating}>
          {lobby.creating ? "Creating..." : "Create Room"}
        </Button>
      </div>

      {lobby.error && <p className="lobby-error">{lobby.error}</p>}

      {/* Room List */}
      <div className="lobby-rooms">
        <div className="lobby-rooms-header">
          <h3>Waiting Rooms</h3>
          <button className="lobby-refresh" onClick={lobby.fetchRooms}>↻ Refresh</button>
        </div>
        {lobby.loading ? (
          <p className="lobby-loading">Loading rooms...</p>
        ) : lobby.rooms.length === 0 ? (
          <p className="lobby-empty">No rooms available. Create one!</p>
        ) : (
          <div className="lobby-room-list">
            {lobby.rooms.map((room) => (
              <div key={room._id} className="lobby-room-card">
                <div className="lobby-room-info">
                  <span className="lobby-room-number">Room #{room.roomNumber}</span>
                  <span className="lobby-room-host">{room.player1?.username || "Unknown"}</span>
                  <span className="lobby-room-details">
                    {room.boardSize}x{room.boardSize} · Marker: {room.player1Marker}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => lobby.joinRoom(room._id)}
                  disabled={room.player1?._id === user?._id}
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
