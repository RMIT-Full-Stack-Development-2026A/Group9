import { useState, useEffect } from "react";
import "./GameHistory.css";
import GameHistoryFilters from "./GameHistoryFilters.jsx";

const RESULT_COLORS = {
	win: "gh-badge--win",
	lose: "gh-badge--lose",
	draw: "gh-badge--draw",
	aborted: "gh-badge--aborted",
};

const TYPE_ICONS = {
	"Single Player": { icon: "bi-robot", wrapClass: "gh-icon-wrap--ai" },
	"Two Players": { icon: "bi-display", wrapClass: "gh-icon-wrap--local" },
	"Online Match": { icon: "bi-globe", wrapClass: "gh-icon-wrap--online" }
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

export default function GameHistory({ history, loading, onFilter, isPremium }) {
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
				<div className="gh-list">
					{history.map((s) => {
						const typeInfo = TYPE_ICONS[s.gameType] || { icon: "bi-joystick", wrapClass: "gh-icon-wrap--default" };
						return (
							<div key={s._id} className="gh-card">
								<div className={`gh-card__icon ${typeInfo.wrapClass}`}>
									<i className={`bi ${typeInfo.icon}`}></i>
								</div>
								<div className="gh-card__info">
									<h4 className="gh-card__title">
										vs {s.opponent || "Unknown"}
										<span className={`gh-badge ${RESULT_COLORS[s.result.toLowerCase()] || ""}`}>
											{s.result}
										</span>
									</h4>
									<p className="gh-card__subtitle">
										<i className="bi bi-circle-fill"></i> {s.gameType} &nbsp;&nbsp; {s.sessionNumber} &nbsp;&nbsp; {formatDate(s.startTime)}
									</p>
								</div>
								
								{isPremium && (
									<div className="gh-card__action">
										<button type="button" className="gh-card__replay-btn">
											<i className="bi bi-play-fill"></i> Replay
										</button>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
