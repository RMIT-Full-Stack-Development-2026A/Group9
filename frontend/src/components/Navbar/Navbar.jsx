import "./Navbar.css";

const NAV_LINKS = [
	{ label: "Home", href: "#", active: true },
	{ label: "Arena", href: "#" },
	{ label: "Profile", href: "#" },
];

export default function Navbar() {
	return (
		<header className="topNavbar" role="banner">
			<div className="brandBlock">
				<span className="brandIconFrame">
					<img className="brandIconImage" src="/logo.png" alt="TicTacToang logo" />
				</span>
				<span className="brandText">
					<span className="brandTextLight">TicTac</span>
					<span className="brandTextAccent">Toang</span>
				</span>
			</div>

			<nav className="mainNav" aria-label="Main navigation">
				{NAV_LINKS.map((item) => (
					<a
						key={item.label}
						className={`mainNavLink${item.active ? " mainNavLink--active" : ""}`}
						href={item.href}
					>
						{item.label}
					</a>
				))}
			</nav>

			<div className="authActions">
				<button className="authBtn authBtn--ghost" type="button">Sign In</button>
				<button className="authBtn authBtn--solid" type="button">Register</button>
			</div>
		</header>
	);
}

