// Pure game logic for TicTacToang.
// This module owns board evaluation, draw detection, and AI move selection.

// Scan the board for the first five-in-a-row line in any direction.
// Returns the winning indices or null when no line exists.
export function checkWinLine(board, size, marker) {
	if (!marker) return null;
	const directions = [
		[0, 1],   // right
		[1, 0],   // down
		[1, 1],   // down-right
		[1, -1],  // down-left
	];
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			const idx = row * size + col;
			if (board[idx] !== marker) continue;
			for (const [dr, dc] of directions) {
				let winLine = [idx];
				let r = row, c = col;
				for (let k = 1; k < 5; k++) {
					r += dr;
					c += dc;
					if (r < 0 || r >= size || c < 0 || c >= size) break;
					const nextIdx = r * size + c;
					if (board[nextIdx] === marker) {
						winLine.push(nextIdx);
					} else {
						break;
					}
				}
				if (winLine.length === 5) {
					return winLine;
				}
			}
		}
	}
	return null;
}

// Return true only when every cell is occupied.
// The caller combines this with win detection to decide draw state.
export function isDraw(board) {
	return board.every(cell => cell !== null && cell !== undefined);
}

// Easy AI: prefer a random empty cell adjacent to the player's last move.
// If no adjacent cell exists, fall back to any empty cell on the board.
export function getEasyAIMove(board, boardSize, lastPlayerMoveIdx) {
	if (lastPlayerMoveIdx == null) {
		const empties = board.map((cell, idx) => (cell ? null : idx)).filter((idx) => idx != null);
		if (empties.length === 0) return null;
		return empties[Math.floor(Math.random() * empties.length)];
	}
	const directions = [
		[0, 1], [1, 0], [0, -1], [-1, 0] // 4 orthogonal only (immediately adjacent)
	];
	const row = Math.floor(lastPlayerMoveIdx / boardSize);
	const col = lastPlayerMoveIdx % boardSize;
	const adjacents = [];
	for (const [dr, dc] of directions) {
		const r = row + dr;
		const c = col + dc;
		if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
			const idx = r * boardSize + c;
			if (!board[idx]) adjacents.push(idx);
		}
	}
	if (adjacents.length === 0) {
		// fallback: pick any empty cell
		const empties = board.map((cell, idx) => cell ? null : idx).filter(idx => idx != null);
		if (empties.length === 0) return null;
		return empties[Math.floor(Math.random() * empties.length)];
	}
	return adjacents[Math.floor(Math.random() * adjacents.length)];
}

// Treat null and undefined as empty cells in this board representation.
function isEmptyCell(cell) {
	return cell === null || cell === undefined;
}

// Guard a row/column pair against out-of-range board access.
function inBounds(size, r, c) {
	return r >= 0 && r < size && c >= 0 && c < size;
}

// Analyze a hypothetical placement without mutating the actual game state.
// The returned values summarize line length, open ends, and tactical shapes.
function analyzePlacement(board, size, idx, marker) {
	const r0 = Math.floor(idx / size);
	const c0 = idx % size;
	const dirs = [
		[0, 1],
		[1, 0],
		[1, 1],
		[1, -1],
	];

	let bestLen = 1;
	let bestOpenEnds = 0;
	let openThree = false;
	let openFour = false;

	for (const [dr, dc] of dirs) {
		let left = 0;
		let rr = r0 - dr;
		let cc = c0 - dc;
		while (inBounds(size, rr, cc) && board[rr * size + cc] === marker) {
			left++;
			rr -= dr;
			cc -= dc;
		}
		const leftOpen = inBounds(size, rr, cc) && isEmptyCell(board[rr * size + cc]);

		let right = 0;
		rr = r0 + dr;
		cc = c0 + dc;
		while (inBounds(size, rr, cc) && board[rr * size + cc] === marker) {
			right++;
			rr += dr;
			cc += dc;
		}
		const rightOpen = inBounds(size, rr, cc) && isEmptyCell(board[rr * size + cc]);

		const len = left + 1 + right;
		const openEnds = (leftOpen ? 1 : 0) + (rightOpen ? 1 : 0);

		if (len > bestLen || (len === bestLen && openEnds > bestOpenEnds)) {
			bestLen = len;
			bestOpenEnds = openEnds;
		}

		if (len === 4 && openEnds === 2) openFour = true;
		if (len === 3 && openEnds === 2) openThree = true;
	}

	return { bestLen, bestOpenEnds, openThree, openFour };
}

// Count how many directions would become open-threes after placing here.
// Used as a cheap fork heuristic for tactical defense and offense.
function countForkThreat(board, size, idx, marker) {
	// fork heuristic: 2+ directions where placing creates an open-three
	const r0 = Math.floor(idx / size);
	const c0 = idx % size;
	const dirs = [
		[0, 1],
		[1, 0],
		[1, 1],
		[1, -1],
	];

	let openThreeDirs = 0;
	for (const [dr, dc] of dirs) {
		let left = 0;
		let rr = r0 - dr;
		let cc = c0 - dc;
		while (inBounds(size, rr, cc) && board[rr * size + cc] === marker) {
			left++;
			rr -= dr;
			cc -= dc;
		}
		const leftOpen = inBounds(size, rr, cc) && isEmptyCell(board[rr * size + cc]);

		let right = 0;
		rr = r0 + dr;
		cc = c0 + dc;
		while (inBounds(size, rr, cc) && board[rr * size + cc] === marker) {
			right++;
			rr += dr;
			cc += dc;
		}
		const rightOpen = inBounds(size, rr, cc) && isEmptyCell(board[rr * size + cc]);

		const len = left + 1 + right;
		const openEnds = (leftOpen ? 1 : 0) + (rightOpen ? 1 : 0);
		if (len === 3 && openEnds === 2) openThreeDirs++;
	}
	return openThreeDirs;
}

// Score empty cells by how well they block opponent threat lines.
// Positions covering multiple directions get a larger defense score.
function detectCrossingForkThreats(board, size, marker) {
	// Find empty cells that intersect multiple opponent threat axes.
	// These are the highest-priority defensive moves because they can block
	// more than one future winning path at once.
	const empties = [];
	const dirs = [
		[0, 1],   // horizontal
		[1, 0],   // vertical
		[1, 1],   // diagonal \
		[1, -1],  // diagonal /
	];

	for (let i = 0; i < board.length; i++) {
		if (isEmptyCell(board[i])) empties.push(i);
	}

	// Evaluate each empty cell as a defensive blocker for the opponent's attack.
	const criticalPositions = [];

	for (const idx of empties) {
		const r0 = Math.floor(idx / size);
		const c0 = idx % size;
		let threatScore = 0;
		const threatsBlockedInDirs = [];

		// Check all four directions from this position.
		for (let dirIdx = 0; dirIdx < dirs.length; dirIdx++) {
			const [dr, dc] = dirs[dirIdx];

			// Count contiguous opponent markers in the negative direction.
			let left = 0;
			let rr = r0 - dr;
			let cc = c0 - dc;
			while (inBounds(size, rr, cc) && board[rr * size + cc] === marker) {
				left++;
				rr -= dr;
				cc -= dc;
			}
			const leftOpen = inBounds(size, rr, cc) && isEmptyCell(board[rr * size + cc]);

			// Count contiguous opponent markers in the positive direction.
			let right = 0;
			rr = r0 + dr;
			cc = c0 + dc;
			while (inBounds(size, rr, cc) && board[rr * size + cc] === marker) {
				right++;
				rr += dr;
				cc += dc;
			}
			const rightOpen = inBounds(size, rr, cc) && isEmptyCell(board[rr * size + cc]);

			const len = left + 1 + right;
			const openEnds = (leftOpen ? 1 : 0) + (rightOpen ? 1 : 0);

			// Reward positions that block stronger threats more heavily.
			// Open-four and open-three patterns are the main tactical dangers.
			if (len === 4 && openEnds === 2) {
				threatScore += 1000; // Highest priority: open-four threat
				threatsBlockedInDirs.push(dirIdx);
			} else if (len === 3 && openEnds === 2) {
				threatScore += 100; // High priority: open-three threat
				threatsBlockedInDirs.push(dirIdx);
			} else if (len === 2 && openEnds === 2) {
				threatScore += 50; // Medium priority: two pieces with expansion room
				threatsBlockedInDirs.push(dirIdx);
			}
		}

		// Boost cells that block threats along multiple directions.
		if (threatsBlockedInDirs.length >= 2) {
			const uniqueDirs = new Set(threatsBlockedInDirs);
			if (uniqueDirs.size >= 2) {
				threatScore *= 5; // Major boost for multi-axis defense
			}
		}

		if (threatScore > 0) {
			criticalPositions.push({
				position: idx,
				threatScore,
				directionsCovered: threatsBlockedInDirs.length,
			});
		}
	}

	// Sort by defensive value so the strongest block appears first.
	criticalPositions.sort((a, b) => b.threatScore - a.threatScore);
	return criticalPositions;
}

// Pick the highest-scoring defensive block from the scored threat list.
function findBestForkBlockingMove(board, size, forkThreats) {
	// Return the best available blocking position, if any.
	if (forkThreats.length === 0) return null;
	return forkThreats[0].position;
}

// Prefer the center area when no tactical move is available.
function chooseCenterishMove(board, size) {
	const center = Math.floor(size / 2);
	const candidates = [];
	for (let dr = -1; dr <= 1; dr++) {
		for (let dc = -1; dc <= 1; dc++) {
			const r = center + dr;
			const c = center + dc;
			if (!inBounds(size, r, c)) continue;
			const idx = r * size + c;
			if (isEmptyCell(board[idx])) candidates.push(idx);
		}
	}
	if (candidates.length > 0) {
		return candidates[Math.floor(Math.random() * candidates.length)];
	}
	return null;
}

// Medium AI: use a tactical ladder before falling back to line extension.
// Priority: win, block win, block open-four, block forks, block open-three,
// then play the most promising offensive move.
export function getMediumAIMove(board, size, lastPlayerMoveIdx, aiMarker, playerMarker) {
	// Track empty cells once so each heuristic can scan the same candidate set.

	const empties = [];
	for (let i = 0; i < board.length; i++) {
		if (isEmptyCell(board[i])) empties.push(i);
	}
	if (empties.length === 0) return null;

	// If we cannot infer the player's marker, there is no reliable threat model.
	// In that case, use a center-ish opening or the easy fallback.
	const inferredPlayerMarker =
		playerMarker || (lastPlayerMoveIdx != null ? board[lastPlayerMoveIdx] : null);
	if (!inferredPlayerMarker) {
		return chooseCenterishMove(board, size) ?? getEasyAIMove(board, size, lastPlayerMoveIdx);
	}

	// Step 1: take a winning move immediately if one exists.
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = aiMarker;
		const win = checkWinLine(board, size, aiMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// Step 2: stop the opponent from winning on their next turn.
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = inferredPlayerMarker;
		const win = checkWinLine(board, size, inferredPlayerMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// Step 3-5: evaluate defensive threat patterns before choosing offense.
	let bestBlockOpenFour = null;
	let bestBlockOpenThree = null;
	let bestBlockFork = null;

	// Inspect the highest-scoring multi-directional fork blocks first.
	const forkThreats = detectCrossingForkThreats(board, size, inferredPlayerMarker);
	if (forkThreats.length > 0) {
		// Promote the top fork threat when it blocks more than one direction.
		const topThreat = forkThreats[0];
		if (topThreat.directionsCovered >= 2 || topThreat.threatScore >= 100) {
			bestBlockFork = topThreat.position;
		}
	}

	// Fallback: scan for the classic open-four and open-three shapes.
	if (!bestBlockFork) {
		for (const idx of empties) {
			const a = analyzePlacement(board, size, idx, inferredPlayerMarker);
			if (a.openFour) {
				bestBlockOpenFour = idx;
			}
			if (!bestBlockOpenThree && a.openThree) {
				bestBlockOpenThree = idx;
			}
		}
	}

	if (bestBlockOpenFour != null) return bestBlockOpenFour;
	if (bestBlockFork != null) return bestBlockFork;
	if (bestBlockOpenThree != null) return bestBlockOpenThree;

	// Step 6: if no defense is needed, extend the AI's strongest line.
	let bestIdx = null;
	let bestScore = -Infinity;
	for (const idx of empties) {
		const a = analyzePlacement(board, size, idx, aiMarker);
		const score = a.bestLen * 10 + a.bestOpenEnds * 2 + (a.openFour ? 50 : 0) + (a.openThree ? 10 : 0);
		if (score > bestScore) {
			bestScore = score;
			bestIdx = idx;
		}
	}
	return bestIdx ?? getEasyAIMove(board, size, lastPlayerMoveIdx);
}

// Hard AI: use the same helper set but with stronger attack/defense ordering.
// It first seeks immediate wins, then blocks direct wins and simulated forks.
export function getHardAIMove(board, size, lastPlayerMoveIdx, aiMarker, playerMarker) {
	const empties = [];
	for (let i = 0; i < board.length; i++) {
		if (isEmptyCell(board[i])) empties.push(i);
	}
	if (empties.length === 0) return null;

	const inferredPlayerMarker =
		playerMarker || (lastPlayerMoveIdx != null ? board[lastPlayerMoveIdx] : null);
	if (!inferredPlayerMarker) {
		return chooseCenterishMove(board, size) ?? getEasyAIMove(board, size, lastPlayerMoveIdx);
	}

	// Step 1: take a winning move immediately whenever possible.
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = aiMarker;
		const win = checkWinLine(board, size, aiMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// Step 2: stop any immediate opponent win.
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = inferredPlayerMarker;
		const win = checkWinLine(board, size, inferredPlayerMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// Step 2.5: block simulated fork points where the opponent could create
	// multiple immediate winning replies after a single placement.
	const simulatedForks = detectSimulatedForks(board, size, inferredPlayerMarker);
	if (simulatedForks.length > 0) {
		// Use the strongest simulated fork blocker first.
		return simulatedForks[0];
	}

	// Step 3: keep the Medium-level defensive requirements, but prefer the
	// strongest fork-blocking response before falling back to the medium AI.
	const forkThreats = detectCrossingForkThreats(board, size, inferredPlayerMarker);
	let hasMediumThreat = false;
	
	if (forkThreats.length > 0) {
		// Treat multi-directional fork threats as urgent defensive moves.
		const topThreat = forkThreats[0];
		if (topThreat.directionsCovered >= 2 || topThreat.threatScore >= 100) {
			hasMediumThreat = true;
		}
	}
	
	if (!hasMediumThreat) {
		// Fall back to cheaper heuristics for open-four, open-three, and fork counts.
		for (const idx of empties) {
			const threat = analyzePlacement(board, size, idx, inferredPlayerMarker);
			const forkThreat = countForkThreat(board, size, idx, inferredPlayerMarker);
			if (threat.openFour || threat.openThree || forkThreat >= 2) {
				hasMediumThreat = true;
				break;
			}
		}
	}
	
	if (hasMediumThreat) {
		// Delegate to Medium AI once a tactical defense is required.
		return getMediumAIMove(board, size, lastPlayerMoveIdx, aiMarker, inferredPlayerMarker);
	}

	// Step 4: no urgent defense exists, so score offensive moves more aggressively.
	let bestIdx = null;
	let bestScore = -Infinity;
	const center = Math.floor(size / 2);

	for (const idx of empties) {
		const r = Math.floor(idx / size);
		const c = idx % size;
		const distToCenter = Math.abs(r - center) + Math.abs(c - center);
		const own = analyzePlacement(board, size, idx, aiMarker);
		const ownFork = countForkThreat(board, size, idx, aiMarker);

		let score = 0;
		// Favor longer lines, more open ends, and tactical shapes that
		// create future threats for the AI.
		score += own.bestLen * 20;
		score += own.bestOpenEnds * 6;
		if (own.openFour) score += 140;
		if (own.openThree) score += 35;
		if (ownFork >= 2) score += 80;
		score -= distToCenter; // slight center preference

		if (score > bestScore) {
			bestScore = score;
			bestIdx = idx;
		}
	}

	return bestIdx ?? getMediumAIMove(board, size, lastPlayerMoveIdx, aiMarker, inferredPlayerMarker);
}

// Simulate opponent moves to find empty cells that create multiple immediate
// winning replies. These are fork points that should be blocked early.
function detectSimulatedForks(board, size, marker) {
	// Simulate an opponent move on candidate cells and count immediate winning replies.
	const empties = [];
	for (let i = 0; i < board.length; i++) if (isEmptyCell(board[i])) empties.push(i);
	if (empties.length === 0) return [];

	// Prefilter with a cheap fork heuristic so we do not simulate every empty cell.
	const candidates = empties.filter((idx) => countForkThreat(board, size, idx, marker) >= 1);
	if (candidates.length === 0) return [];

	const forks = [];
	for (const idx of candidates) {
		// Place the hypothetical opponent move and count all immediate winning replies.
		board[idx] = marker;
		let winCount = 0;
		for (const j of empties) {
			if (j === idx) continue;
			if (!isEmptyCell(board[j])) continue;
			board[j] = marker;
			const win = checkWinLine(board, size, marker);
			board[j] = null;
			if (win) {
				winCount++;
				if (winCount >= 2) break;
			}
		}
		board[idx] = null;
		if (winCount >= 2) forks.push(idx);
	}
	return forks;
}