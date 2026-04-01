import "./Home.css";

// TODO(login-integration): Remove mock users after real login stores authenticated user data.
const MOCK_NORMAL_USER = {
    _id: "65f0a1b2c3d4e5f6a7b8c9d1",
    username: "DragonSlayer99",
    role: "player",
    premiumUntil: null,
};

const MOCK_PREMIUM_USER = {
    _id: "65f0a1b2c3d4e5f6a7b8c9d1",
    username: "DragonSlayer99",
    role: "premium",
    premiumUntil: "2099-12-31T00:00:00.000Z",
};

function extractUserRecord(payload) {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    if (payload.user && typeof payload.user === "object") {
        return payload.user;
    }

    if (payload.data && typeof payload.data === "object") {
        if (payload.data.user && typeof payload.data.user === "object") {
            return payload.data.user;
        }

        // Some APIs store user fields directly under data.
        if (payload.data.username || payload.data.email || payload.data.role) {
            return payload.data;
        }
    }

    return payload;
}

function getStoredUser() {
    const storageKeys = ["currentUser", "user", "authUser"];

    for (const key of storageKeys) {
        const rawValue = localStorage.getItem(key);
        if (!rawValue) {
            continue;
        }

        try {
            const parsedValue = JSON.parse(rawValue);
            if (parsedValue && typeof parsedValue === "object") {
                return extractUserRecord(parsedValue);
            }
        } catch {
            // Ignore malformed values and continue checking other keys.
        }
    }

    return null;
}

function isPremiumUser(user) {
    const role = String(user.role || "").toLowerCase();
    if (role === "premium") {
        return true;
    }

    if (!user.premiumUntil) {
        return false;
    }

    const premiumUntilDate = new Date(user.premiumUntil);
    return !Number.isNaN(premiumUntilDate.getTime()) && premiumUntilDate.getTime() > Date.now();
}

function getWelcomeLine(user) {
    if (!user) {
        return {
            text: "WELCOME TO TICTACTOANG",
            type: "guest",
        };
    }

    const displayName = String(user.username || user.name || user.email || "PLAYER")
        .split("@")[0]
        .toUpperCase();

    if (isPremiumUser(user)) {
        return {
            text: `PREMIUM MEMBER - WELCOME, ${displayName}`,
            type: "premium",
        };
    }

    return {
        text: `WELCOME, ${displayName}`,
        type: "normal",
    };
}

// TODO(login-integration): Delete this helper when login flow is merged.
function applyMockUser(mode) {
    const storageKeys = ["currentUser", "user", "authUser"];

    for (const key of storageKeys) {
        localStorage.removeItem(key);
    }

    if (mode === "normal") {
        localStorage.setItem("currentUser", JSON.stringify(MOCK_NORMAL_USER));
    }

    if (mode === "premium") {
        localStorage.setItem("currentUser", JSON.stringify(MOCK_PREMIUM_USER));
    }

    window.location.reload();
}

export default function Home() {
    const currentUser = getStoredUser();
    const welcome = getWelcomeLine(currentUser);
    // TODO(login-integration): Remove DEV toggle with mock buttons after login integration.
    const isDev = import.meta.env.DEV;

  return (
    <main>
        <section>
            <p className={`welcomeLine welcomeLine--${welcome.type}`}>
                {welcome.type === "premium" && <i className="bi bi-stars welcomeLineStar" aria-hidden="true"></i>}
                {welcome.text}
                {welcome.type === "premium" && <i className="bi bi-stars welcomeLineStar" aria-hidden="true"></i>}
            </p>
            {/* TODO(login-integration): Remove this DEV-only mock switcher after login integration. */}
            {isDev && (
                <div className="welcomeTestTools" role="group" aria-label="Welcome line mock states">
                    <button className="welcomeTestBtn" onClick={() => applyMockUser("guest")} type="button">Guest</button>
                    <button className="welcomeTestBtn" onClick={() => applyMockUser("normal")} type="button">Normal</button>
                    <button className="welcomeTestBtn" onClick={() => applyMockUser("premium")} type="button">Premium</button>
                </div>
            )}
            <h1 className="fw-bold">
                <span className="heroTitleC">Choose Your</span><br /> 
                <span className="heroTitleA">Battle</span>
                <span className="heroTitleB"> Mode</span>
            </h1>
            <p>Five in a row wins. Pick your arena and let the strategy begin.</p>
        </section>

        <section className="modeRow row1">
            <button className="btn1">
                <span className="Model_icon">
                    <i className="bi bi-display" style={{ fontSize: 32, color: "#06B6D4" }}></i>
                </span>
                <span className="Model_name fw-bold">Local 2‑Player<br/></span>
                <span className="Model_desc">Play against a friend on the same device. Share the keyboard and battle it out.</span>
            </button>
            
            <button className="btn1">
                <span className="Model_icon">
                    <i className="bi bi-robot" style={{ fontSize: 32, color: "#8B5CF6" }}></i>
                </span>
                <span className="Model_name fw-bold">vs AI</span>
                <span className="Model_desc">Test your strategy against our AI. Choose Easy, Medium, or Hard difficulty.</span>
            </button>

            <button className="btn1">
                <span className="Model_icon">
                    <i className="bi bi-globe2" style={{ fontSize: 32, color: "#06B6D4" }}></i>
                </span>
                <span className="Model_name fw-bold">Online Match</span>
                <span className="Model_desc">Create a room and challenge players worldwide in real-time.</span>
            </button>
        </section>

        <section className="modeRow row2">
            <button className="btn text-white actionBtn actionBtn--cyan">
            <span className="btn_icon">
                 <i className="bi bi-people me-2"></i>
            </span>
            <span className="btn_name">Browse Rooms</span>
            </button>

            <button className="btn text-white actionBtn actionBtn--purple">
                <span className="btn_icon">
                     <i className="bi bi-book me-2"></i>
                </span>
                <span className="btn_name">My History</span>
            </button>

            <button className="btn text-white actionBtn actionBtn--orange">
                <span className="btn_icon me-2">
                    <i className="bi bi-gem"></i>
                </span>
                <span className="btn_name">Go Premium</span>
            </button>
        </section>
    </main>
    
  );
}