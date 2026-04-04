import { Link } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import "./Home.css";

const Home = ({ user }) => {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">
          <span className="tic">TicTac</span>
          <span className="toang">Toang</span>
        </h1>
        <p className="home-subtitle">
          The ultimate 5-in-a-row challenge. Play locally, against AI, or online!
        </p>
      </div>

      <div className="home-modes">
        <Link to="/game?mode=local" className="mode-card">
          <span className="mode-icon">🖥️</span>
          <h3>Two Players</h3>
          <p>Play on the same PC with a friend</p>
        </Link>

        <Link to="/game?mode=single" className="mode-card">
          <span className="mode-icon">🤖</span>
          <h3>vs AI</h3>
          <p>Challenge the computer at Easy, Medium, or Hard</p>
        </Link>

        <Link to="/leaderboard" className="mode-card">
          <span className="mode-icon">🏆</span>
          <h3>Leaderboard</h3>
          <p>See the top players and your ranking</p>
        </Link>
      </div>

      {!user && (
        <div className="home-cta">
          <p>Sign in to start playing and track your stats!</p>
          <Link to="/login">
            <Button variant="primary" size="lg">Sign In</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
