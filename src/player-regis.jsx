import { useState, useRef } from 'react';
import './player-regis.css';

const PlayerRegis = () => {
  const [formData, setformData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    avatar: null
  });

  const [apiError, setApiErrors] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[A-Za-z0-9_-]+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#@!])[A-Za-z\d$#@!]{8,}$/;

  const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'Vietnam', 'France', 'India', 'China', 'Japan'];

  // --- Avatar Validation Logic ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setApiErrors(prev => prev.filter(err => err.field !== 'avatar'));

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setApiErrors(prev => [...prev, { field: 'avatar', error: 'Invalid Format', cause: 'Only JPG and PNG images are allowed.', example: 'Convert your image to .jpg or .png and try again.' }]);
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setApiErrors(prev => [...prev, { field: 'avatar', error: 'File Too Large', cause: 'The image exceeds the 5MB size limit.', example: 'Compress your image or choose a smaller one.' }]);
      return;
    }

    setformData({ ...formData, avatar: file });
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errors = [];
    // Username validation
    if (!usernameRegex.test(formData.username)) {
      errors.push({
        field: 'username',
        error: 'Invalid Characters',
        cause: 'Only letter, number, _ and - allowed.',
        example: 'TicTacToe_P1ayer'
      });
    }
    // Password Validation
    if (!passRegex.test(formData.password)) {
      errors.push({ 
        field: 'password', 
        error: 'Weak Password', 
        cause: 'Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.', 
        example: 'G@mer2026!' 
      });
    }
    // Password match check
    if (formData.password !== formData.confirmPassword) {
      errors.push({
        field: 'confirmPassword',
        error: 'Mismatch',
        cause: 'Password does not match.',
        example: 'Make sure that both field are the same'
      });
    }
    // Email format check    
    if (!emailRegex.test(formData.email)) {
      errors.push({
        field: 'email',
        error: 'Invalid Email Format',
        cause: 'The email address is missing a valid domain or "@" symbol.',
        example: 'player1@gmail.com, admin@domain.net'
      });
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErrors([]);

    const localErrors = validate();
    if (localErrors.length > 0) return setApiErrors(localErrors);

    const submitData = new FormData();
    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('country', formData.country);
    if (formData.avatar) submitData.append('avatar', formData.avatar);

  try {
      const response = await fetch('/api/register', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();
      if(!response.ok) {
        setApiErrors(data.errors || [{error: 'Unknown Error'}]);
      } else {
        alert("Registration Successful")
      }
    } catch (err) {
      // Catch network errors if the backend is down
      setApiErrors([{ error: 'Network Error', cause: 'Could not reach the server.', example: 'Check if backend is running on port 5000.' }]);
    }
  };

  const getFieldError = (fieldName) => apiError.find(err => err.field === fieldName);
  const isUsernameValid = formData.username.length > 2 && !getFieldError('username');

  const ErrorIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>);
  const SuccessIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>);
  
  return (
    <div className="page-container">
      <div className="header-section">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <h1>Join Our Community</h1>
        <p>Create your account and start playing</p>
      </div>

      <div className="form-card">
        <h2>Create Account</h2>
        <p className="form-subtitle">Fill in your details to get started</p>

        <form onSubmit={handleSubmit}>
          
          {/* Profile Picture Section */}
          <div className="profile-section">
            <label className={getFieldError('avatar') ? 'error-label' : ''}>Profile Picture</label>
            <div className="profile-upload-row">
              <div className="avatar-circle" style={{ overflow: 'hidden' }}>
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
                <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>Choose Image</button>
                <div className="upload-hint">Upload a profile picture (JPG, PNG, max 5MB)</div>
              </div>
            </div>
            {getFieldError('avatar') && (
              <div className="validation-msg error" style={{ marginTop: '0.75rem' }}><ErrorIcon/> {getFieldError('avatar').cause}</div>
            )}
          </div>
            {/* Username Section */}
          <div className="form-group">
            <label className={getFieldError('username') ? 'error-label' : ''}>Username</label>
            <input 
              type="text" 
              placeholder="DragonSlayer99"
              className={getFieldError('username') ? 'error-input' : ''}
              onChange={(e) => setformData({...formData, username: e.target.value})} 
              required 
            />
            {getFieldError('username') ? (
              <div className="validation-msg error"><ErrorIcon/> {getFieldError('username').cause}</div>
            ) : isUsernameValid ? (
              <div className="validation-msg success"><SuccessIcon/> Username is available</div>
            ) : null}
          </div>
            {/* Email Section */}
          <div className="form-group">
            <label className={getFieldError('email') ? 'error-label' : ''}>Email Address</label>
            <input 
              type="email" 
              placeholder="your.email@example.com"
              className={getFieldError('email') ? 'error-input' : ''}
              onChange={(e) => setformData({...formData, email: e.target.value})} 
              required 
            />
            {getFieldError('email') ? (
              <div className="validation-msg error"><ErrorIcon/> {getFieldError('email').cause}</div>
            ) : (
              <div className="hint-text">We'll send a verification email to this address</div>
            )}
          </div>
            {/* Password Section */}
          <div className="form-group">
            <label className={getFieldError('password') ? 'error-label' : ''}>Password</label>
            <input 
              type="password" 
              placeholder="Example123!"
              className={getFieldError('password') ? 'error-input' : ''}
              onChange={(e) => setformData({...formData, password: e.target.value})} 
              required 
            />
            {getFieldError('password') ? (
              <div className="validation-msg error"><ErrorIcon/> {getFieldError('password').cause}</div>
            ) : passRegex.test(formData.password) ? (
              <>
                <div className="strength-bar"></div>
                <div className="hint-text">Password strength: Strong</div>
              </>
            ) : null}
          </div>
            {/* Confirm Password Section */}
          <div className="form-group">
            <label className={getFieldError('confirmPassword') ? 'error-label' : ''}>Confirm Password</label>
            <input 
              type="password" 
              placeholder="Example123!"
              className={getFieldError('confirmPassword') ? 'error-input' : ''}
              onChange={(e) => setformData({...formData, confirmPassword: e.target.value})} 
              required 
            />
            {getFieldError('confirmPassword') && (
              <div className="validation-msg error"><ErrorIcon/> {getFieldError('confirmPassword').cause}</div>
            )}
          </div>
            {/* Country Selection */}
          <div className="form-group">
            <label>Country</label>
            <select defaultValue="" onChange={(e) => setformData({...formData, country: e.target.value})} required>
              <option value="" disabled>Select a country...</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="divider">or</div>

          <div className="terms-text">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </div>
          <div className="login-link">
            Already have an account? <a href="signin.jsx">Sign in</a>
          </div>

          <button type="submit" className="btn-submit">
            Create Account
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </form>

        {/* Backend errors that don't map to a specific field */}
        {apiError.length > 0 && !apiError[0].field && (
          <div className="server-error-box">
            <p><strong>Server Error:</strong> {apiError[0].error}</p>
            <p><strong>Cause:</strong> {apiError[0].cause}</p>
            <p><strong>Fix:</strong> {apiError[0].example || apiError[0].examples}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerRegis;
