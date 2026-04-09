import { useState, useEffect } from "react";
import "./GameHistory.css";
import GameHistoryFilters from "./GameHistoryFilters.jsx";

const RESULT_COLORS = {
	win: "gh-badge--win",
	lose: "gh-badge--lose",
	draw: "gh-badge--draw",
	aborted: "gh-badge--aborted",
};

const formatDate = (iso) => {
	if (!iso) return "—";
	const d = new Date(iso);
	return d.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}) + " " + d.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

export default function GameHistory({ history, loading, onFilter }) {
	const [filters, setFilters] = useState({
		search: "",
		result: "",
		gameType: "",
		dateFrom: "",
		dateTo: "",
		sortOrder: "desc",
	});

	useEffect(() => {
		onFilter(filters);
	}, []);

	const handleFilterChange = (newFilters) => {
		setFilters(newFilters);
		onFilter(newFilters);
	};

	return (
		<div className="game-history">
			<GameHistoryFilters filters={filters} onChange={handleFilterChange} />

			{loading ? (
				<div className="gh-loading">
					<div className="gh-spinner"></div>
					<p>Loading history…</p>
				</div>
			) : history.length === 0 ? (
				<div className="gh-empty">
					<i className="bi bi-controller"></i>
					<p>No game sessions found</p>
				</div>
			) : (
				<div className="gh-table-wrap">
					<table className="gh-table" id="game-history-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Start Time</th>
								<th>End Time</th>
								<th>Type</th>
								<th>Opponent</th>
								<th>Result</th>
							</tr>
						</thead>
						<tbody>
							{history.map((s) => (
								<tr key={s._id}>
									<td className="gh-cell--num">{s.sessionNumber}</td>
									<td>{formatDate(s.startTime)}</td>
									<td>{formatDate(s.endTime)}</td>
									<td>
										<span className="gh-type">{s.gameTypeLabel}</span>
									</td>
									<td className="gh-cell--player">{s.player2Name || "—"}</td>
									<td>
										<span className={`gh-badge ${RESULT_COLORS[s.result] || ""}`}>
											{s.result?.toUpperCase()}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
