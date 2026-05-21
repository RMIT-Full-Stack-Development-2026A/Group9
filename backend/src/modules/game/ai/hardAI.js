import { getHardAIMove as engineHardAIMove } from "../engine/gameEngine.js";

// Re-export the engine's hard AI move chooser for module consumers.
export const getHardAIMove = engineHardAIMove;