/**
 * ============================================================================
 * LOGIN PAGE (The Entry Point)
 * ============================================================================
 * Location: src/pages/Login.jsx
 * Purpose: This page serves as the dedicated entry point for returning users.
 * It follows the "Thin Page" pattern, acting only as a layout container for 
 * the modular LoginForm.
 * * Key Responsibilities:
 * 1. Visual Layout: Providing a focused, distraction-free UI for credentials.
 * 2. Navigation Logic: Redirecting users to the Home or Game Arena after 
 * successful authentication.
 * 3. Guest Access: Providing a link for new users to reach the Registration page.
 */

import LoginForm from "../components/LoginForm/LoginForm.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../app/providers/AuthProvider.jsx";
import { Navigate } from "react-router-dom";

export default function Login() {
    const { user } = useContext(AuthContext) || {};
    if (user && user.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    return <LoginForm />;
}