import { useState, useRef } from 'react';
import { registerPlayer } from './Registration.service';

export const useRegistration = () => {
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
    if (!usernameRegex.test(formData.username)) {
      errors.push({ field: 'username', error: 'Invalid Characters', cause: 'Only letter, number, _ and - allowed.', example: 'TicTacToe_P1ayer' });
    }
    if (!passRegex.test(formData.password)) {
      errors.push({ field: 'password', error: 'Weak Password', cause: 'Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character.', example: 'G@mer2026!' });
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push({ field: 'confirmPassword', error: 'Mismatch', cause: 'Password does not match.', example: 'Make sure that both field are the same' });
    }
    if (!emailRegex.test(formData.email)) {
      errors.push({ field: 'email', error: 'Invalid Email Format', cause: 'The email address is missing a valid domain or "@" symbol.', example: 'player1@gmail.com, admin@domain.net' });
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
      await registerPlayer(submitData);
      alert("Registration Successful!");
    } catch (errors) {
      setApiErrors(errors);
    }
  };

  const getFieldError = (fieldName) => apiError.find(err => err.field === fieldName);
  const isUsernameValid = formData.username.length > 2 && !getFieldError('username');

  // Expose exactly what the UI needs
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
    passRegex
  };
};