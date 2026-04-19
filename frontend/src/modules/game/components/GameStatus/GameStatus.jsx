/**
 * ============================================================================
 * GAME STATUS COMPONENT (The Match Info Bar)
 * ============================================================================
 * Location: src/modules/game/components/GameStatus.jsx
 * Purpose: This component provides the real-time context of the match. It 
 * tells the player whose turn it is, if they won, or if the match is a draw.
 * * Key Responsibilities:
 * 1. Turn Indication: Highlighting the active player (X or O).
 * 2. Result Messaging: Displaying "You Win!", "You Lose!", or "Draw!".
 * 3. Player Identity: Showing usernames and avatars next to their symbols.
 * 4. Match State: Displaying 'Waiting for opponent' during matchmaking.
 */
export const GameStatus = ({ isP1Turn, winner, status, p1Mark, p2Mark }) => {
  if (status === 'aborted') return <div className="alert alert-danger">Game Aborted!</div>;
  if (winner) return <div className="alert alert-success">Winner: {winner}!</div>;

  return (
    <div className="status-indicator">
      Current Turn: <strong>{isP1Turn ? p1Mark : p2Mark}</strong>
    </div>
  );
};