import React from 'react';

const Home = () => {
    return (
        <div className="container mt-5">
            <div className="p-5 bg-white border rounded-3 shadow-sm text-dark">
                <h1 className="display-4 fw-bold">Welcome to TicTacToang!</h1>
                <p className="lead text-secondary">
                    The backend is connected, the frontend is wired up.
                </p>
                <hr className="my-4" />
                <p>Use the navigation to get started or test the login flow.</p>
            </div>
        </div>
    );
};

export default Home;