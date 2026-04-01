import "./Home.css";

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

export default function Home() {
    const currentUser = getStoredUser();
    const welcome = getWelcomeLine(currentUser);

  return (
    <main>
        <section>
            <p className={`welcomeLine welcomeLine--${welcome.type}`}>{welcome.text}</p>
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