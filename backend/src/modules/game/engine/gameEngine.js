// Pure game logic for TicTacToang

// Returns array of winning cell indices or null
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

// Returns true if the board is full (draw)
export function isDraw(board) {
	return board.every(cell => cell !== null && cell !== undefined);
}

// Returns the index for AI's move (Easy): random empty cell adjacent to player's last move
// If no adjacent, pick any empty cell
export function getEasyAIMove(board, boardSize, lastPlayerMoveIdx) {
	if (lastPlayerMoveIdx == null) {
		const empties = board.map((cell, idx) => (cell ? null : idx)).filter((idx) => idx != null);
		if (empties.length === 0) return null;
		return empties[Math.floor(Math.random() * empties.length)];
	}
	const directions = [
		[0, 1], [1, 0], [0, -1], [-1, 0], // 4 orthogonal
		[1, 1], [1, -1], [-1, 1], [-1, -1] // 4 diagonal
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

function isEmptyCell(cell) {
	return cell === null || cell === undefined;
}

function inBounds(size, r, c) {
	return r >= 0 && r < size && c >= 0 && c < size;
}

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

export function getMediumAIMove(board, size, lastPlayerMoveIdx, aiMarker, playerMarker) {
	// Medium priorities:
	// 1) Win now
	// 2) Block opponent win
	// 3) Block opponent open-4 (two-ended)
	// 4) Block opponent open-3 (two-ended)
	// 5) Block fork (two open-threes)
	// 6) Otherwise: choose best extending move, fallback easy

	const empties = [];
	for (let i = 0; i < board.length; i++) {
		if (isEmptyCell(board[i])) empties.push(i);
	}
	if (empties.length === 0) return null;

	// If we don't know player marker (AI starts), just play easy.
	const inferredPlayerMarker =
		playerMarker || (lastPlayerMoveIdx != null ? board[lastPlayerMoveIdx] : null);
	if (!inferredPlayerMarker) {
		return chooseCenterishMove(board, size) ?? getEasyAIMove(board, size, lastPlayerMoveIdx);
	}

	// Win now
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = aiMarker;
		const win = checkWinLine(board, size, aiMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// Block opponent win
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = inferredPlayerMarker;
		const win = checkWinLine(board, size, inferredPlayerMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// Threat heuristics
	let bestBlockOpenFour = null;
	let bestBlockOpenThree = null;
	let bestBlockFork = null;

	for (const idx of empties) {
		const a = analyzePlacement(board, size, idx, inferredPlayerMarker);
		if (a.openFour) bestBlockOpenFour = idx;
		if (!bestBlockOpenThree && a.openThree) bestBlockOpenThree = idx;
		const forkCount = countForkThreat(board, size, idx, inferredPlayerMarker);
		if (forkCount >= 2) bestBlockFork = idx;
	}

	if (bestBlockOpenFour != null) return bestBlockOpenFour;
	if (bestBlockFork != null) return bestBlockFork;
	if (bestBlockOpenThree != null) return bestBlockOpenThree;

	// Otherwise pick a good move for AI (extend own lines)
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

//Hard AI mode
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

	// 1) Attack: take win immediately whenever possible
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = aiMarker;
		const win = checkWinLine(board, size, aiMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// 2) Highest-priority defense: block immediate player win
	for (const idx of empties) {
		const tmp = board[idx];
		board[idx] = inferredPlayerMarker;
		const win = checkWinLine(board, size, inferredPlayerMarker);
		board[idx] = tmp;
		if (win) return idx;
	}

	// 3) Keep all defensive requirements from Medium (open-4/open-3/fork blocking)
	let hasMediumThreat = false;
	for (const idx of empties) {
		const threat = analyzePlacement(board, size, idx, inferredPlayerMarker);
		const forkThreat = countForkThreat(board, size, idx, inferredPlayerMarker);
		if (threat.openFour || threat.openThree || forkThreat >= 2) {
			hasMediumThreat = true;
			break;
		}
	}
	if (hasMediumThreat) {
		return getMediumAIMove(board, size, lastPlayerMoveIdx, aiMarker, inferredPlayerMarker);
	}

	// 4) No urgent defense -> stronger offense than Medium
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