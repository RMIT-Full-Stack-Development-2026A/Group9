
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