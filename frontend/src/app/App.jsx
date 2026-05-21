
/*
    App.jsx
    Root application entry component for the React app.
    - Renders the top-level `Router` which contains all route definitions and
        layout decisions. Keeps this file intentionally minimal so that the
        routing and layout logic remain centralized in `Router.jsx`.
*/

import Router from "./Router.jsx";
import "../shared/styles/global.css"; // global app styles

function App() {
    // The app is a tiny wrapper whose sole responsibility is to mount the
    // application's router. Keeping this minimal improves testability and
    // makes it easy to add global providers here in the future (e.g. theme,
    // error boundary) without changing route files.
    return <Router />;
}

export default App;