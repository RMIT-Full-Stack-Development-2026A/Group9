import "./Home.css";
import { useHome } from "./Home.hook";

export default function Home() {
    const { welcome, showRankings } = useHome();

  return (
    <main>
        <section>
            <p className={`welcomeLine welcomeLine--${welcome.type}`}>
                {welcome.type === "premium" && <i className="bi bi-stars welcomeLineStar" aria-hidden="true"></i>}
                {welcome.text}
                {welcome.type === "premium" && <i className="bi bi-stars welcomeLineStar" aria-hidden="true"></i>}
            </p>
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

            <button className={`btn text-white actionBtn ${showRankings ? "actionBtn--red" : "actionBtn--orange"}`}>
                <span className="btn_icon me-2">
                    <i className={`bi ${showRankings ? "bi-trophy" : "bi-gem"}`}></i>
                </span>
                <span className="btn_name">{showRankings ? "Rankings" : "Go Premium"}</span>
            </button>
        </section>
    </main>
    
  );
}