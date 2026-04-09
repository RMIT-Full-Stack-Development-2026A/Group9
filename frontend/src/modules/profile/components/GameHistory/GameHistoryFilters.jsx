import "./GameHistoryFilters.css";

export default function GameHistoryFilters({ filters, onChange }) {
	const update = (field, value) => {
		onChange({ ...filters, [field]: value });
	};

	return (
		<div className="ghf">
			{/* ── Search ──────────────────────────────────────────── */}
			<div className="ghf__group ghf__group--search">
				<label className="ghf__label">
					<i className="bi bi-search"></i> Search
				</label>
				<input
					id="history-search"
					className="ghf__input"
					type="text"
					placeholder="Session # or Player name…"
					value={filters.search}
					onChange={(e) => update("search", e.target.value)}
				/>
			</div>

			{/* ── Game Type ───────────────────────────────────────── */}
			<div className="ghf__group">
				<label className="ghf__label">Game Type</label>
				<select
					id="filter-game-type"
					className="ghf__input"
					value={filters.gameType}
					onChange={(e) => update("gameType", e.target.value)}
				>
					<option value="">All Types</option>
					<option value="ai">Single Player</option>
					<option value="classic">Two Players</option>
					<option value="multiplayer">Online Match</option>
				</select>
			</div>

			{/* ── Result ──────────────────────────────────────────── */}
			<div className="ghf__group">
				<label className="ghf__label">Result</label>
				<select
					id="filter-result"
					className="ghf__input"
					value={filters.result}
					onChange={(e) => update("result", e.target.value)}
				>
					<option value="">All Results</option>
					<option value="player1_win">Win</option>
					<option value="player2_win">Lose</option>
					<option value="draw">Draw</option>
					<option value="aborted">Aborted</option>
				</select>
			</div>

			{/* ── Date From ───────────────────────────────────────── */}
			<div className="ghf__group">
				<label className="ghf__label">From</label>
				<input
					id="filter-date-from"
					className="ghf__input"
					type="date"
					value={filters.dateFrom}
					onChange={(e) => update("dateFrom", e.target.value)}
				/>
			</div>

			{/* ── Date To ─────────────────────────────────────────── */}
			<div className="ghf__group">
				<label className="ghf__label">To</label>
				<input
					id="filter-date-to"
					className="ghf__input"
					type="date"
					value={filters.dateTo}
					onChange={(e) => update("dateTo", e.target.value)}
				/>
			</div>

			{/* ── Sort Order ──────────────────────────────────────── */}
			<div className="ghf__group">
				<label className="ghf__label">Sort</label>
				<button
					id="sort-toggle"
					className="ghf__sort-btn"
					type="button"
					onClick={() =>
						update("sortOrder", filters.sortOrder === "desc" ? "asc" : "desc")
					}
				>
					<i className={`bi bi-sort-${filters.sortOrder === "desc" ? "down" : "up"}`}></i>
					{filters.sortOrder === "desc" ? "Newest First" : "Oldest First"}
				</button>
			</div>
		</div>
	);
}
