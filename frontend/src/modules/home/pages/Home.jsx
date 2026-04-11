import React from 'react';

const Home = () => {
    return (
        <div className="container mt-5">
            <div className="jumbotron p-5 bg-light border rounded-3">
                <h1 className="display-4">Welcome to TicTacToang!</h1>
                <p className="lead">The backend is connected, the frontend is wired up.</p>
                <hr className="my-4" />
                <p>Use the navigation to get started or test the login flow.</p>
            </div>
        </div>
    );
};

export default Home;