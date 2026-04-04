/**
 * Game DTOs — present only necessary data in responses (A.3.2).
 */

export const toGameSessionDTO = (session) => {
  const obj = session.toObject ? session.toObject() : session;
  return {
    _id: obj._id,
    sessionNumber: obj.sessionNumber,
    gameType: obj.gameType,
    boardSize: obj.boardSize,
    result: obj.result,
    startTime: obj.startTime,
    endTime: obj.endTime,
    botName: obj.botName,
    localPlayer2Name: obj.localPlayer2Name,
    players: obj.players?.map((p) =>
      typeof p === "object" ? { _id: p._id, username: p.username } : p
    ),
    winner: obj.winner
      ? typeof obj.winner === "object"
        ? { _id: obj.winner._id, username: obj.winner.username }
        : obj.winner
      : null,
  };
};

export const toMoveDTO = (move) => {
  const obj = move.toObject ? move.toObject() : move;
  return {
    _id: obj._id,
    playerId: obj.playerId,
    marker: obj.marker,
    position: obj.position,
    row: obj.row,
    col: obj.col,
    moveNumber: obj.moveNumber,
    createdAt: obj.createdAt,
  };
};
