/**
 * ============================================================================
 * GAME SERVICE (The Logic Coordinator)
 * ============================================================================
 * Location: src/modules/game/services/game.service.js
 * Purpose: This service acts as the "Brain" of the game module. While 
 * game.api.js handles HTTP and useMultiplayer handles Sockets, this service 
 * processes raw game data into usable formats for the UI.
 * * Key Responsibilities:
 * 1. Win Detection: Validating the 3-in-a-row logic (Shared with Hook).
 * 2. Data Normalization: Formatting raw server responses for the Board.
 * 3. Match Analytics: Calculating win rates or XP gains from match data.
 * 4. Sound/Effect Triggers: Determining which "Toang" sounds to play.
 */

export const formatMatchPayload = (startTime, winner, players, size) => {
    return {
        startTime,
        endTime: new Date().toISOString(),
        participants: players.map(p => p.id),
        result: winner ? winner.id : "DRAW",
        metadata: {
            boardSize: `${size}x${size}`,
            mode: "Local/AI"
        }
    };
};