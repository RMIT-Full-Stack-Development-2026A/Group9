/**
 * ============================================================================
 * LOGIN FORM (The Auth Gateway)
 * ============================================================================
 * Location: src/modules/auth/components/LoginForm.jsx
 * Purpose: This component handles the actual user interaction for logging in.
 * It manages local form state, input validation, and calls the 'useLogin' 
 * custom hook to communicate with the backend.
 * * Key Responsibilities:
 * 1. State Management: Handling 'email' and 'password' input values.
 * 2. Form Validation: Checking for empty fields before hitting the API.
 * 3. Error Handling: Displaying "Invalid Credentials" or "Server Down" 
 * feedback directly to the user.
 * 4. UI Polish: Disabling the button during the "Loading" state to 
 * prevent double-submissions.
 */

import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from "/src/app/providers/AuthProvider.jsx";
import { api } from "/src/services/api.js";
import { AUTH_TOKEN_KEY } from "/src/config/api.config.js";
import { FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi'; 
import styles from './LoginForm.module.css';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    //redirect user to where they were trying to go or homepage
    const from = location.state?.from || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/api/auth/login', { identifier, password });
            
            //jws storage
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.accessToken);
            
            //update global state
            login(response.data.user);
            
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.payload?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/*header*/}
            <div className={styles.headerSection}>
                <div className={styles.iconCircle}>
                    <FiLock />
                </div>
                <h1 className={styles.welcomeText}>Welcome Back</h1>
                <p className={styles.welcomeSubtext}>Sign in to continue your adventure</p>
            </div>

            {/*login card*/}
            <div className={styles.loginCard}>
                <h2 className={styles.cardTitle}>Sign In</h2>
                <p className={styles.cardSubtitle}>Enter your credentials to access your account</p>

                {error && (
                    <div className={styles.errorAlert}>
						<FiAlertCircle className={styles.errorIcon} />
						<div className={styles.errorContent}>
							<span className={styles.errorTitle}>Invalid credentials</span>
							<p className={styles.errorDescription}>{error}</p>
						</div>
					</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Username or Email</label>
                        <input 
                            type="text" 
                            className={styles.customInput} 
                            placeholder="Enter your username or email"
                            value={identifier} 
                            onChange={(e) => setIdentifier(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.inputLabel}>Password</label>
                        <input 
                            type="password" 
                            className={styles.customInput} 
                            placeholder="Enter your password"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className={styles.formFooter}>
                        <div className={styles.rememberMe}>
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Remember me</label>
                        </div>
                        <Link to="/forgot-password" className={styles.forgotLink}>
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className={styles.signInBtn} disabled={isLoading}>
                        <FiCheck />
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.registerLinkSection}>
                    Don't have an account? 
                    <Link to="/register" className={styles.registerLink}> Create one</Link>
                </div>
            </div>
        </div>
    );
}