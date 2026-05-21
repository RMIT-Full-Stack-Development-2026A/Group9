/*
  useRegistration.js
  - Encapsulates registration form state, client-side validation, avatar
    preview handling, and submission logic.
  - Key behaviors explained below:
    * Local validation is performed using `validateRegistration` before
      any network request to provide immediate feedback.
    * Avatars are validated with `validateAvatarFile` and previewed using
      `URL.createObjectURL` for quick UX.
    * Submission uses `FormData` to include the optional avatar binary in
      the same request. The hook normalizes server-side validation errors
      into `apiError` array which the form component can display.
*/

import { useState, useRef } from 'react';
import { validateRegistration, validateAvatarFile } from '/src/shared/utils/validators.js';
import { useNavigate } from 'react-router-dom';
import { registerPlayer } from '../services/auth.service';

export const useRegistration = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setformData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    avatar: null
  });

  // `apiError` follows the contract used by the UI: an array of
  // { field, error, cause } objects or a generic server error at index 0.
  const [apiError, setApiErrors] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Avatar file change handler: validate file client-side and set preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Clear previous avatar-related errors
    setApiErrors(prev => prev.filter(err => err.field !== 'avatar'));
    const avatarError = validateAvatarFile(file);
    if (avatarError) {
      setApiErrors(prev => [...prev, avatarError]);
      return;
    }
    setformData({ ...formData, avatar: file });
    // Create a temporary object URL for local preview. Remember to revoke
    // it if you hold many previews to avoid leaking memory (not required
    // here because navigation clears it quickly).
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Form submission handler: runs local validation, builds FormData and
  // calls `registerPlayer`. On success, shows a short notification and
  // navigates to the login page.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiErrors([]);

    const localErrors = validateRegistration(formData);
    if (localErrors.length > 0) return setApiErrors(localErrors);

    const submitData = new FormData();
    submitData.append('username', formData.username);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);
    submitData.append('country', formData.country);
    if (formData.avatar) submitData.append('avatar', formData.avatar);

    try {
      await registerPlayer(submitData);
      setShowSuccess(true);
      // Briefly show a success state to improve UX before redirecting.
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 1800); // Show notification for 1.8 seconds
    } catch (errors) {
      // Server validation errors are surfaced as an array and directly
      // assigned to `apiError` so the form can show field-level feedback.
      setApiErrors(errors);
    }
  };

  const getFieldError = (fieldName) => apiError.find(err => err.field === fieldName);
  const isUsernameValid = formData.username.length > 2 && !getFieldError('username');

  return {
    formData,
    setformData,
    apiError,
    avatarPreview,
    fileInputRef,
    handleAvatarChange,
    handleSubmit,
    getFieldError,
    isUsernameValid,
    showSuccess,
  };
};