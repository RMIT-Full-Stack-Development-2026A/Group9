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

import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../app/providers/AuthProvider.jsx';
import { api } from '../../../services/api.js';
import { AUTH_TOKEN_KEY } from '../../../config/api.config.js';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    //redirect user to where they were trying to go or homepage
    const from = location.state?.from || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/api/auth/login', { identifier, password });
            
            //jws storage
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.accessToken);
            
            //update global state
            login(response.data.user);
            
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.payload?.message || "Login failed");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Login to TicTacToang</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username or Email</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={identifier} 
                            onChange={(e) => setIdentifier(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}