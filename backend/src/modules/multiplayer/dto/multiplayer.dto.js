/**
 * Multiplayer DTOs — present only necessary data in responses (A.3.2).
 */

export const toRoomDTO = (room) => {
  const obj = room.toObject ? room.toObject() : room;
  return {
    _id: obj._id,
    roomNumber: obj.roomNumber,
    player1: obj.player1
      ? { _id: obj.player1._id, username: obj.player1.username, avatar: obj.player1.avatar }
      : null,
    player2: obj.player2
      ? { _id: obj.player2._id, username: obj.player2.username, avatar: obj.player2.avatar }
      : null,
    status: obj.status,
    boardSize: obj.boardSize,
    player1Marker: obj.player1Marker,
    player2Marker: obj.player2Marker,
    firstPlayer: obj.firstPlayer || "player1",
    sessionId: obj.sessionId?.toString?.() || obj.sessionId || null,
    startTime: obj.startTime,
    endTime: obj.endTime,
  };
};

export const toRoomListDTO = (room) => {
  const obj = room.toObject ? room.toObject() : room;
  return {
    _id: obj._id,
    roomNumber: obj.roomNumber,
    player1: obj.player1
      ? { _id: obj.player1._id, username: obj.player1.username }
      : null,
    status: obj.status,
    boardSize: obj.boardSize,
    startTime: obj.startTime,
  };
};