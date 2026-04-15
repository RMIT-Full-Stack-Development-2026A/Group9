
import { useState } from "react";
import styles from './RoomTable.module.css';

const RoomTable = ({ curRooms, setRooms }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRooms = curRooms.filter(r => (
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.player1.toLowerCase().includes(searchQuery.toLowerCase())
    ));

    const close = (roomNum) => {
        const updateRooms = curRooms.filter(r => r.roomNumber !== roomNum);
        setRooms(updateRooms);
    };

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
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th className={styles.roomTableThLast}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRooms.map(r => (
                            <tr key={r.roomNumber}>
                                <td className={styles.roomTableCellFirst}>{r.roomNumber}</td>
                                <td>{r.player1}</td>
                                <td>{r.player2}</td>
                                <td>{r.startTime}</td>
                                <td>{r.endTime}</td>
                                <td>{r.duration}</td>
                                <td>
                                    <span>
                                        <span className={styles.statusDot + ' ' + (r.status === 'Active' ? styles.statusActive : styles.statusInactive)}></span>
                                        {r.status === 'Active' ? (
                                            <span className={styles.statusTextActive}>Active</span>
                                        ) : (
                                            <span className={styles.statusTextInactive}>{r.status}</span>
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={styles.actionBtn + ' ' + styles.close}
                                        onClick={() => close(r.roomNumber)}
                                    >
                                        Close
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