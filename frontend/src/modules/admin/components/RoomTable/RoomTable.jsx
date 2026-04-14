import { useState } from "react";
import './RoomTable.css'
let RoomTable = ({ curRooms, setRooms }) => {
    const [searchQuery, setSearchQuery] = useState('');

    let filteredRooms = curRooms.filter(r => (
        r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.player1.toLowerCase().includes(searchQuery.toLowerCase())
    ))
    let close = (roomNum) => {
        const updateRooms = curRooms.filter(r => r.roomNumber !== roomNum)
        setRooms(updateRooms);
    }


    return (
        <div className='container' >
            <h5 className='title'>Online Game Rooms</h5>

            <div className='searchBar'>
                <input
                    type="text"
                    id='sBar'
                    placeholder='Search by room number or player...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className='tableContainer'>
                <table className='tablePlayer'>
                    <thead>
                        <tr>
                            <td>Room Number</td>
                            <td>Player 1</td>
                            <td>Player 2</td>
                            <td>Start Time</td>
                            <td>End Time</td>
                            <td>Duration</td>
                            <td>Status</td>
                            <td>Action</td>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRooms.map(r => {
                            return (
                                <tr key={r.roomNumber} >
                                    <td>{r.roomNumber}</td>
                                    <td>{r.player1}</td>
                                    <td>{r.player2}</td>
                                    <td>{r.startTime}</td>
                                    <td>{r.endTime}</td>
                                    <td>{r.duration}</td>
                                    <td>{r.status}</td>
                                    <td>
                                        <button onClick={() => { close(r.roomNumber) }} >Close</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
export default RoomTable