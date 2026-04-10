import "./GameHistoryFilters.css";

export default function GameHistoryFilters({ filters, onChange }) {
	const update = (field, value) => {
		onChange({ ...filters, [field]: value });
	};

	return (
		<div className="ghf">
			{/* ── Search Row ──────────────────────────────────────────── */}
			<div className="ghf__search-row">
				<div className="ghf__search-input-wrap">
					<i className="bi bi-search ghf__search-icon"></i>
					<input
						id="history-search"
						className="ghf__search-input"
						type="text"
						placeholder="Search by opponent name..."
						value={filters.search}
						onChange={(e) => update("search", e.target.value)}
					/>
				</div>
				<button type="button" className="ghf__search-btn">
					Search
				</button>
			</div>

			{/* ── Filter Pills Row ────────────────────────────────────── */}
			<div className="ghf__filters-row">
				<div className="ghf__pill-wrap">
					<select
						className="ghf__pill"
						value={filters.gameType}
						onChange={(e) => update("gameType", e.target.value)}
					>
						<option value="">All Types</option>
						<option value="single">Single Player</option>
						<option value="local">Two Players</option>
						<option value="online">Online Match</option>
					</select>
				</div>

				<div className="ghf__pill-wrap">
					<select
						className="ghf__pill"
						value={filters.result}
						onChange={(e) => update("result", e.target.value)}
					>
						<option value="">All Results</option>
						<option value="win">Win</option>
						<option value="lose">Lose</option>
						<option value="draw">Draw</option>
						<option value="aborted">Aborted</option>
					</select>
				</div>

				<div className="ghf__pill-wrap">
					<input
						type="date"
						className="ghf__pill ghf__pill--date"
						value={filters.dateFrom}
						onChange={(e) => update("dateFrom", e.target.value)}
						title="Date From"
					/>
				</div>

				<div className="ghf__pill-wrap">
					<input
						type="date"
						className="ghf__pill ghf__pill--date"
						value={filters.dateTo}
						onChange={(e) => update("dateTo", e.target.value)}
						title="Date To"
					/>
				</div>
			</div>
		</div>
	);
}
