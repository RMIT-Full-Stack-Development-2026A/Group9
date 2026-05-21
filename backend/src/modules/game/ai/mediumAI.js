import { getMediumAIMove as engineMediumAIMove } from "../engine/gameEngine.js";

// Re-export the engine's medium AI move chooser for module consumers.
export const getMediumAIMove = engineMediumAIMove;
