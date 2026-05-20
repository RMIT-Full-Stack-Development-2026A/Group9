import * as mp from '../../../multiplayer/services/multiplayer.api.js';

export async function fetchActiveRooms() {
    const res = await mp.getActiveRooms();
    return res?.data ?? [];
}

export async function closeRoom(roomId) {
    const res = await mp.closeRoom(roomId);
    return res?.data ?? res;
}
