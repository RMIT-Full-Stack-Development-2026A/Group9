
import { useState } from "react";
import { adminService } from "../../services/admin.service";
import styles from './RoomTable.module.css';

const RoomTable = ({ curRooms, setRooms }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(null);

    const close = async (roomId) => {
        try {
            setLoading(roomId);
            await adminService.closeRoom(roomId);
            const updateRooms = curRooms.filter(r => r._id !== roomId);
            setRooms(updateRooms);
        } catch (err) {
            alert("Failed to close room: " + (err.message || "Unknown error"));
        } finally {
            setLoading(null);
        }
    };

    const filteredRooms = curRooms.filter(r => (
        (r.roomNumber && r.roomNumber.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.player1 && r.player1.toLowerCase().includes(searchQuery.toLowerCase()))
    ));

    return (
        <div className={styles.roomCard}>
            <div>
                <h3 className={styles.roomCardTitle}>Online Game Rooms</h3>
                <div className={styles.roomCardSubtitle}>Monitor and manage active game sessions</div>
            </div>
            <div className={styles.searchBarContainer}>
                <span className={styles.searchIcon}>
                    <i className="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    className={styles.roomSearchInput}
                    placeholder="Search by room number or player..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className={styles.roomTableWrapper}>
                <table className={styles.roomTable}>
                    <thead>
                        <tr>
                            <th className={styles.roomTableThFirst}>Room Number</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Start Time</th>
                            <th>Status</th>
                            <th className={styles.roomTableThLast}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRooms.map(r => (
                            <tr key={r._id || r.roomNumber}>
                                <td className={styles.roomTableCellFirst}>{r.roomNumber}</td>
                                <td>{r.player1}</td>
                                <td>{r.player2 || "Waiting..."}</td>
                                <td>{r.startTime ? new Date(r.startTime).toLocaleString() : "—"}</td>
                                <td>
                                    <span>
                                        <span className={styles.statusDot + ' ' + (r.status === 'playing' ? styles.statusActive : styles.statusInactive)}></span>
                                        {r.status === 'playing' ? (
                                            <span className={styles.statusTextActive}>Active</span>
                                        ) : (
                                            <span className={styles.statusTextInactive}>{r.status}</span>
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={styles.actionBtn + ' ' + styles.close}
                                        onClick={() => close(r._id)}
                                        disabled={loading === r._id}
                                    >
                                        {loading === r._id ? "Closing..." : "Close"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoomTable;