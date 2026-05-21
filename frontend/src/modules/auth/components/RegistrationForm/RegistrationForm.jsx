import { useRegistration } from '../../hooks/useRegistration';
import { Link } from 'react-router-dom';
import styles from './RegistrationForm.module.css';
import { COUNTRIES } from "../../../../shared/constants/countries.js";
import { isValidUsername, isEmail } from "../../../../shared/utils/validators.js";

const ErrorIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>);
const SuccessIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);

const Registration = () => {
  const {
    formData,
    setformData,
    apiError,
    avatarPreview,
    fileInputRef,
    handleAvatarChange,
    handleSubmit,
    getFieldError,
    showSuccess,
  } = useRegistration();

  const pwd = formData.password || '';
  const pwdChecks = {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number: /\d/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
  const pwdScore = Object.values(pwdChecks).filter(Boolean).length;
  const username = formData.username || '';
  const usernameChecks = {
    allowed: isValidUsername(username),
    length: username.length >= 3,
  };
  const email = formData.email || '';
  const emailValid = isEmail(email);
  return (
    <div className={styles.pageContainer}>
      {/*
        RegistrationForm
        - Uses `useRegistration` for state and submission.
        - Responsibilities:
          * Render form inputs + client-side hints for username/email/password
          * Show field-level server validation errors received via `apiError`
          * Provide a seamless avatar upload + preview experience
      */}
      {showSuccess && (
        <div className={styles.successNotification}>
          <SuccessIcon />
          Registration successful! Redirecting to login…
        </div>
      )}
      <div className={styles.headerSection}>
        <div className={styles.headerIcon}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h1>Join Our Community</h1>
        <p>Create your account and start playing</p>
      </div>

      <div className={styles.formCard}>
        <h2>Create Account</h2>
        <p className={styles.formSubtitle}>Fill in your details to get started</p>

        <form onSubmit={handleSubmit}>
          
          <div className={styles.profileSection}>
            <label className={getFieldError('avatar') ? styles.errorLabel : ''}>Profile Picture</label>
            <div className={styles.profileUploadRow}>
              <div className={styles.avatarCircle} style={{ overflow: 'hidden' }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                )}
              </div>
              <div>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png" 
                  style={{ display: 'none' }} 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                />
                <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>Choose Image</button>
                <div className={styles.uploadHint}>Upload a profile picture (JPG, PNG, max 5MB)</div>
              </div>
            </div>
            {getFieldError('avatar') && (
              <div className={`${styles.validationMsg} ${styles.error}`} style={{ marginTop: '0.75rem' }}><ErrorIcon/> {getFieldError('avatar').cause}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('username') ? styles.errorLabel : ''}>Username</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              className={getFieldError('username') ? styles.errorInput : ''}
              onChange={(e) => setformData({...formData, username: e.target.value})} 
            />
            {getFieldError('username') ? (
              <div className={`${styles.validationMsg} ${styles.error}`}><ErrorIcon/> {getFieldError('username').cause}</div>
            ) : null}
            <div className={styles.hintText}>
              <div className={styles.validationMsg}>
                {usernameChecks.length ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>
                )}
                <span style={{marginLeft:8}}>At least 3 characters</span>
              </div>
              <div className={styles.validationMsg}>
                {usernameChecks.allowed ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>
                )}
                <span style={{marginLeft:8}}>Only letters, numbers, underscore or hyphen</span>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('email') ? styles.errorLabel : ''}>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email@example.com"
              className={getFieldError('email') ? styles.errorInput : ''}
              onChange={(e) => setformData({...formData, email: e.target.value})} 
            />
            {getFieldError('email') ? (
              <div className={`${styles.validationMsg} ${styles.error}`}><ErrorIcon/> {getFieldError('email').cause}</div>
            )  : null}
            <div className={styles.hintText}>
              <div className={styles.validationMsg}>
                {email === '' ? (
                  <span style={{color:'var(--text-muted)'}}>We'll never share your email.</span>
                ) : emailValid ? (
                  <div className={`${styles.validationMsg} ${styles.success}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span style={{marginLeft:8}}>Valid email format</span></div>
                ) : (
                  <div className={`${styles.validationMsg} ${styles.error}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg><span style={{marginLeft:8}}>Enter a valid email (e.g. user@example.com)</span></div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('password') ? styles.errorLabel : ''}>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              className={getFieldError('password') ? styles.errorInput : ''}
              onChange={(e) => setformData({...formData, password: e.target.value})} 
            />
            {getFieldError('password') ? (
              <div className={`${styles.validationMsg} ${styles.error}`}><ErrorIcon/> {getFieldError('password').cause}</div>
            ) : null}

            <div className={styles.hintText}>
              <div className={styles.validationMsg} style={{marginTop:'0.5rem'}}>
                {pwdChecks.length ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>
                )}
                <span style={{marginLeft:8}}>At least 8 characters</span>
              </div>
              <div className={styles.validationMsg}>
                {pwdChecks.uppercase ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>
                )}
                <span style={{marginLeft:8}}>One uppercase letter (A–Z)</span>
              </div>
              <div className={styles.validationMsg}>
                {pwdChecks.number ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>
                )}
                <span style={{marginLeft:8}}>One number (0–9)</span>
              </div>
              <div className={styles.validationMsg}>
                {pwdChecks.special ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"></circle></svg>
                )}
                <span style={{marginLeft:8}}>One special character (e.g. $#@!)</span>
              </div>

              <div className={styles.strengthBar} style={{width: `${(pwdScore / 4) * 100}%`, background: pwdScore >= 3 ? 'var(--success)' : (pwdScore === 2 ? 'orange' : 'var(--error)') }} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('confirmPassword') ? styles.errorLabel : ''}>Confirm Password</label>
            <input 
              type="password" 
              placeholder="Enter your password again"
              className={getFieldError('confirmPassword') ? styles.errorInput : ''}
              onChange={(e) => setformData({...formData, confirmPassword: e.target.value})} 
            />
            {getFieldError('confirmPassword') && (
              <div className={`${styles.validationMsg} ${styles.error}`}><ErrorIcon/> {getFieldError('confirmPassword').cause}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Country</label>
            <select defaultValue="" onChange={(e) => setformData({...formData, country: e.target.value})}>
              <option value="" disabled>Select a country...</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.divider}>or</div>

          <div className={styles.termsText}>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </div>
          <div className={styles.loginLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </div>

          <button type="submit" className={styles.btnSubmit}>
            Create Account
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </form>

        {apiError.length > 0 && !apiError[0].field && (
          <div className={styles.serverErrorBox}>
            <p><strong>Error:</strong> {apiError[0].error}</p>
            <p><strong>Cause:</strong> {apiError[0].cause}</p>
            <p><strong>Fix:</strong> {apiError[0].example || apiError[0].examples}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;