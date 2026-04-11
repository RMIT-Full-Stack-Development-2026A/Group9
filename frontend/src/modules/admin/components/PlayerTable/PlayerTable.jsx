import { useState } from 'react';
import './PlayerTable.css';

let PlayerTable = ({ gamers, setgamers }) => {
    

    const [searchQuery,setSearchQuery]= useState('');

    let toggleDeactivate = (pid) => {
        const updateGamers = gamers.map(p => {
            if (p.id === pid) {
                return { ...p, isDeactivated: !p.isDeactivated };
            }
            return p;
        });
        setgamers(updateGamers);
    }

    let filteredPlayers = gamers.filter( p => (
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    ))

    return (
        <div className='container' >
            <h5 className='title'>All players</h5>

            <div className='searchBar'>
                <input 
                    type="text" 
                    id='sBar'
                    placeholder='Search by username or email'
                    value={searchQuery}
                    onChange={(e)=> setSearchQuery(e.target.value)}
                />
            </div>

            <div className='tableContainer'>
                <table className='tablePlayer'>
                    <thead>
                        <tr>
                            <td >Username</td>
                            <td>Email</td>
                            <td>Prenium Status</td>
                            <td>Account Status</td>
                            <td>Join Date</td>
                            <td>Actions</td>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPlayers.map(p => {
                            return (
                                <tr key={p.id} >
                                    <td>{p.username}</td>
                                    <td>{p.email}</td>
                                    <td>{p.isPremium ? "Premium" : "Free"}</td>
                                    <td>{p.isActive ? "Active" : "Inactive"}</td>
                                    <td>{p.joinedDate}</td>
                                    <td>
                                        <button onClick={() => { toggleDeactivate(p.id) }} >
                                            {p.isDeactivated ? "Reactivate" : "Deactivate"}
                                        </button>
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
export default PlayerTable;