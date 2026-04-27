/**
 * ============================================================================
 * HOME CONTENT COMPONENT (The Lobby Hub)
 * ============================================================================
 * Location: src/modules/home/components/HomeContent.jsx
 * Purpose: This is the primary landing experience for authenticated players.
 * It serves as the "Lobby" where users can choose their game mode, view 
 * their quick stats, and see global announcements.
 * * Key Responsibilities:
 * 1. Mode Selection: Offering Single Player (AI) vs. Multiplayer (Online).
 * 2. Player Overview: Displaying a snapshot of the user's Rank and XP.
 * 3. News/Updates: Showing the latest "Toang" patch notes or events.
 * 4. Call to Action: The big "PLAY NOW" entry point into matchmaking.
 */

import styles from "./HomeContent.module.css";
import { useHome } from "../../hooks/useHome.js";
import Button from "../../../../shared/ui/Button/Button.jsx";

import { useContext, useState } from "react";
import { AuthContext } from "../../../../app/providers/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import LocalGameModal from "../../../game/components/GameModals/LocalGameModal.jsx";
import AIGameModal from "../../../game/components/GameModals/AIGameModal.jsx";

export default function Home() {
const { welcome, showRankings } = useHome();
    const welcomeClass = styles[`welcomeLine--${welcome.type}`] || "";
    const { isAuthenticated } = useContext(AuthContext) || {};
    const navigate = useNavigate();
    const [showLocalModal, setShowLocalModal] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);

    // Handler for guest users
    const requireAuth = (callback) => (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            navigate("/login");
            return;
        }
        if (callback) callback(e);
    };

    const handleLocalGameClick = requireAuth(() => setShowLocalModal(true));
    const handleAIGameClick = requireAuth(() => setShowAIModal(true));

    return (
        <>
        <main className={styles.container}>
        <section>
            <p className={`${styles.welcomeLine} ${welcomeClass}`}>
                {welcome.type === "premium" && <i className={`bi bi-stars ${styles.welcomeLineStar}`} aria-hidden="true"></i>}
                {welcome.text}
                {welcome.type === "premium" && <i className={`bi bi-stars ${styles.welcomeLineStar}`} aria-hidden="true"></i>}
            </p>
            <h1 className={`fw-bold ${styles.title}`}>
                <span className={styles.heroTitleC}>Choose Your</span><br /> 
                <span className={styles.heroTitleA}>Battle</span>
                <span className={styles.heroTitleB}> Mode</span>
            </h1>
            <p className={styles.subtitle}>Five in a row wins. Pick your arena and let the strategy begin.</p>
        </section>

        <section className={`${styles.modeRow} ${styles.row1}`}>
            <button className={styles.btn1} onClick={handleLocalGameClick}>
                <span className={styles.Model_icon}>
                    <i className="bi bi-display" style={{ fontSize: 32, color: "#06B6D4" }}></i>
                </span>
                <span className={`${styles.Model_name} fw-bold`}>Local 2‑Player<br/></span>
                <span className={styles.Model_desc}>Play against a friend on the same device. Share the keyboard and battle it out.</span>
            </button>
            <button className={styles.btn1} onClick={handleAIGameClick}>
                <span className={styles.Model_icon}>
                    <i className="bi bi-robot" style={{ fontSize: 32, color: "#8B5CF6" }}></i>
                </span>
                <span className={`${styles.Model_name} fw-bold`}>vs AI</span>
                <span className={styles.Model_desc}>Test your strategy against our AI. Choose Easy, Medium, or Hard difficulty.</span>
            </button>
            <button className={styles.btn1} onClick={requireAuth()}>
                <span className={styles.Model_icon}>
                    <i className="bi bi-globe2" style={{ fontSize: 32, color: "#06B6D4" }}></i>
                </span>
                <span className={`${styles.Model_name} fw-bold`}>Online Match</span>
                <span className={styles.Model_desc}>Create a room and challenge players worldwide in real-time.</span>
            </button>
        </section>

        <section className={`${styles.modeRow} ${styles.row2}`}>
            <Button
                className={`${styles.btn} text-white ${styles["actionBtn--cyan"]}`}
                color="#06b6d4"
                icon={
                    <span className="btn_icon">
                        <i className="bi bi-people"></i>
                    </span>
                }
                text="Browse Rooms"
                onClick={requireAuth()}
            />

            <Button
                className={`${styles.btn} text-white ${styles["actionBtn--purple"]}`}
                color="#8b5cf6"
                icon={
                    <span className="btn_icon">
                        <i className="bi bi-book"></i>
                    </span>
                }
                text="My History"
                onClick={requireAuth(() => {
                  navigate("/profile", { state: { tab: "history" } });
                })}
            />

            <Button
                className={`${styles.btn} text-white ${showRankings ? styles["actionBtn--red"] : styles["actionBtn--orange"]}`}
                color={showRankings ? "--color-danger" : "--premium-orange"}
                icon={
                    <span className="btn_icon">
                        <i className={`bi ${showRankings ? "bi-trophy" : "bi-gem"}`}></i>
                    </span>
                }
                text={showRankings ? "Rankings" : "Go Premium"}
                onClick={requireAuth(() => {
                  navigate(showRankings ? "/leaderboard" : "/payment");
                })}
            />
        </section>
    </main>
    <LocalGameModal open={showLocalModal} onClose={() => setShowLocalModal(false)} />
    <AIGameModal open={showAIModal} onClose={() => setShowAIModal(false)} />
        </>
  );
}