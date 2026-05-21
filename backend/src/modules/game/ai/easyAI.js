import { getEasyAIMove as engineEasyAIMove } from '../engine/gameEngine.js';

// Re-export the engine's easy AI move chooser for module consumers.
export const getEasyAIMove = engineEasyAIMove;
