import styles from './RegistrationForm.module.css';
import { useRegistration } from '../../hooks/useRegistration';

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const RegistrationForm = () => {
  const {
    formData,
    setformData,
    apiError,
    avatarPreview,
    fileInputRef,
    handleAvatarChange,
    handleSubmit,
    getFieldError,
  } = useRegistration();

  const countries = [
    'USA',
    'Canada',
    'UK',
    'Australia',
    'Germany',
    'Vietnam',
    'France',
    'India',
    'China',
    'Japan',
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerIcon}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h1>Join Our Community</h1>
        <p>Create your account and start playing</p>
      </div>

      <div className={styles.formCard}>
        <h2>Create Account</h2>
        <p className={styles.formSubtitle}>Fill in your details to get started</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.profileSection}>
            <label className={getFieldError('avatar') ? styles.errorLabel : ''}>
              Profile Picture
            </label>
            <div className={styles.profileUploadRow}>
              <div className={styles.avatarCircle}>
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className={styles.avatarPreview}
                  />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className={styles.uploadColumn}>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  ref={fileInputRef}
                  className={styles.hiddenInput}
                  onChange={handleAvatarChange}
                />
                <button
                  type="button"
                  className={styles.uploadBtn}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Image
                </button>
                <div className={styles.uploadHint}>
                  Upload a profile picture (JPG, PNG, max 5MB)
                </div>
              </div>
            </div>
            {getFieldError('avatar') && (
              <div className={`${styles.validationMsg} ${styles.error}`}>
                <ErrorIcon /> {getFieldError('avatar').cause}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('username') ? styles.errorLabel : ''}>
              Username
            </label>
            <input
              type="text"
              placeholder="DragonSlayer99"
              className={getFieldError('username') ? styles.errorInput : ''}
              value={formData.username}
              onChange={(e) => setformData({ ...formData, username: e.target.value })}
              required
            />
            {getFieldError('username') && (
              <div className={`${styles.validationMsg} ${styles.error}`}>
                <ErrorIcon /> {getFieldError('username').cause}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('email') ? styles.errorLabel : ''}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className={getFieldError('email') ? styles.errorInput : ''}
              value={formData.email}
              onChange={(e) => setformData({ ...formData, email: e.target.value })}
              required
            />
            {getFieldError('email') && (
              <div className={`${styles.validationMsg} ${styles.error}`}>
                <ErrorIcon /> {getFieldError('email').cause}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('password') ? styles.errorLabel : ''}>
              Password
            </label>
            <input
              type="password"
              placeholder="Example123!"
              className={getFieldError('password') ? styles.errorInput : ''}
              value={formData.password}
              onChange={(e) => setformData({ ...formData, password: e.target.value })}
              required
            />
            {getFieldError('password') && (
              <div className={`${styles.validationMsg} ${styles.error}`}>
                <ErrorIcon /> {getFieldError('password').cause}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={getFieldError('confirmPassword') ? styles.errorLabel : ''}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Example123!"
              className={getFieldError('confirmPassword') ? styles.errorInput : ''}
              value={formData.confirmPassword}
              onChange={(e) => setformData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            {getFieldError('confirmPassword') && (
              <div className={`${styles.validationMsg} ${styles.error}`}>
                <ErrorIcon /> {getFieldError('confirmPassword').cause}
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Country</label>
            <select
              value={formData.country}
              onChange={(e) => setformData({ ...formData, country: e.target.value })}
              required
            >
              <option value="" disabled>
                Select a country...
              </option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.divider}>or</div>

          <div className={styles.termsText}>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </div>
          <div className={styles.loginLink}>
            Already have an account? <a href="/login">Sign in</a>
          </div>

          <button type="submit" className={styles.btnSubmit}>
            Create Account
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {apiError.length > 0 && !apiError[0].field && (
          <div className={styles.serverErrorBox}>
            <p>
              <strong>Server Error:</strong> {apiError[0].error}
            </p>
            <p>
              <strong>Cause:</strong> {apiError[0].cause}
            </p>
            <p>
              <strong>Fix:</strong> {apiError[0].example || apiError[0].examples}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
