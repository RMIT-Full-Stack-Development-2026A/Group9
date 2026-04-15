/**
 * ============================================================================
 * HOME PAGE (The Main Hub)
 * ============================================================================
 * Location: src/pages/Home.jsx
 * Purpose: This is the first thing players see. It acts as the "Landing Page" 
 * for guests and the "Dashboard" for logged-in users.
 * * Key Responsibilities:
 * 1. Conditional Rendering: Showing a "Hero" section for guests vs. a 
 * "Quick Play" menu for authenticated users.
 * 2. Navigation: Providing clear paths to Login, Register, or the Game Arena.
 * 3. Marketing: Briefly explaining the "TicTacToang" twist (the leveling system).
 */

import HomeContent from "../components/HomeContent/HomeContent.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import { Navigate } from "react-router-dom";

export default function Home() {
    const { user } = useContext(AuthContext) || {};
    if (user && user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    return <HomeContent />;
}