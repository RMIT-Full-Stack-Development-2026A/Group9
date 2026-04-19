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

export const GameService = {
  //Win Detection: Validating the 5-in-a-row logic 
  checkWinner: (grid, row, col, player, boardSize) => {
    const directions = [
      { r: 0, c: 1 },  // Horizontal
      { r: 1, c: 0 },  // Vertical
      { r: 1, c: 1 },  // Diagonal \
      { r: 1, c: -1 }  // Diagonal /
    ];

    for (let { r: dr, c: dc } of directions) {
      let count = 1;

      // Check forward direction
      for (let i = 1; i < 5; i++) {
        const nr = row + dr * i;
        const nc = col + dc * i;
        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && grid[nr][nc] === player) {
          count++;
        } else break;
      }

      // Check backward direction
      for (let i = 1; i < 5; i++) {
        const nr = row - dr * i;
        const nc = col - dc * i;
        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && grid[nr][nc] === player) {
          count++;
        } else break;
      }

      if (count >= 5) return true;
    }
    return false;
  },
  /*Sound/Effect Triggers: Determining which "Toang" sounds to play.
  getSoundTrigger: (event, context = {}) => {
    const sounds = {
      MOVE: '/assets/sounds/place-mark.mp3',
      WIN: '/assets/sounds/victory-cheer.mp3',
      TOANG: '/assets/sounds/toang-break.mp3', // Played on loss or abort
      DRAW: '/assets/sounds/draw-game.mp3'
    };

    return sounds[event] || null;
  },
  */
   //Initialize a board  (Default 10x10) 
  createEmptyBoard: (size = 10) => {
    return Array(size).fill(null).map(() => Array(size).fill(null));
  }
};