import * as mp from '../../../multiplayer/services/multiplayer.api.js';

/*
    adminGameRooms.api.js
    - Small adapter that re-uses the multiplayer API but returns a shape
    - that's convenient for the admin components (often `res.data`).
    - Encapsulating this mapping prevents duplication of `?.data` checks
    - across UI components and centralizes changes if the multiplayer API
    - response shape evolves.
*/
export async function fetchActiveRooms() {
    const res = await mp.getActiveRooms();
    return res?.data ?? [];
}

export async function closeRoom(roomId) {
    const res = await mp.closeRoom(roomId);
    return res?.data ?? res;
}
