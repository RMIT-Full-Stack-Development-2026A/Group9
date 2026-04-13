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

  const [apiError, setApiErrors] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);



  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setApiErrors(prev => prev.filter(err => err.field !== 'avatar'));
    const avatarError = validateAvatarFile(file);
    if (avatarError) {
      setApiErrors(prev => [...prev, avatarError]);
      return;
    }
    setformData({ ...formData, avatar: file });
    setAvatarPreview(URL.createObjectURL(file));
  };


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
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 1800); // Show notification for 1.8 seconds
    } catch (errors) {
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