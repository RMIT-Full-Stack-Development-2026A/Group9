/*
    LoginForm.jsx
    - Presentational login form with client-side validation and submission
        logic delegated to `useLogin`. Responsibilities:
        * Validate input using shared validators before submitting.
        * Use `useLogin` to perform the HTTP login call and expose submission
            state so the UI can show a loading indicator.
        * On successful login, persist token/profile (done in service) and
            call `AuthContext.login` to update global auth state.
        * Redirect user to the originally requested location or home.
*/

import { validateLogin } from "/src/shared/utils/validators.js";
import Input from "/src/shared/ui/Input/Input.jsx";
import Button from "/src/shared/ui/Button/Button.jsx";
import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from "/src/app/providers/AuthProvider.jsx";
import { useLogin } from "../../hooks/useLogin.js";
import { FiLock, FiAlertCircle, FiCheck } from 'react-icons/fi'; 
import styles from './LoginForm.module.css';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, isSubmitting, error } = useLogin();
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    //redirect user to where they were trying to go or homepage
    const from = location.state?.from || "/";

    const [validationError, setValidationError] = useState("");
    const [loginError, setLoginError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError("");
        setLoginError("");
        const validation = validateLogin({ identifier, password });
        if (validation) {
            setValidationError(validation.error);
            return;
        }
        try {
            const response = await handleLogin({ identifier, password });
            // Only proceed if response contains accessToken and user
            const accessToken = response.accessToken || response.data?.accessToken;
            let user = response.user || response.data?.user;
            if (!accessToken || !user) {
                setLoginError("Invalid credentials");
                return;
            }
            // Persist token locally (service already does this) and attempt
            // to fetch a full profile in case the login response is minimal.
            localStorage.setItem("authToken", accessToken);
            // Always fetch latest profile after login to get country and other fields
            try {
                const profileRes = await fetch("/api/users/profile", {
                    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
                });
                if (profileRes.ok) {
                    user = await profileRes.json();
                }
            } catch (e) { /* ignore profile fetch errors */ }
            // Update global auth state so other components re-render accordingly.
            login(user);
            // Redirect admin users to /admin, others to previous logic
            if (user && user.role && user.role.toLowerCase() === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            // Surface either the hook error or the thrown exception message
            setLoginError(err?.message || error || "Login failed");
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

                    {(validationError || loginError) && (
                        <div className={styles.errorAlert}>
                            <FiAlertCircle className={styles.errorIcon} />
                            <div className={styles.errorContent}>
                                <span className={styles.errorTitle}>{validationError ? "Validation error" : "Invalid credentials"}</span>
                                <p className={styles.errorDescription}>{validationError || loginError}</p>
                            </div>
                        </div>
                    )}


                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <Input
                                label="Username or Email"
                                type="text"
                                name="identifier"
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                placeholder="Enter your name or email"
                                error={!!validationError && validationError.toLowerCase().includes('email')}
                                errorMessage={validationError && validationError.toLowerCase().includes('email') ? validationError : ''}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                error={!!validationError && validationError.toLowerCase().includes('password')}
                                errorMessage={validationError && validationError.toLowerCase().includes('password') ? validationError : ''}
                            />
                        </div>
                        <Button
                            type="submit"
                            className={styles.signInBtn}
                            disabled={isSubmitting}
                            icon={<FiCheck />}
                            style={{ width: '100%' }}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className={styles.registerLinkSection}>
                        Don't have an account?
                        <Link to="/register" className={styles.registerLink}> Create one</Link>
                    </div>
                </div>
        </div>
    );
}