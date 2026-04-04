import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as registrationService from "./Registration.service.js";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateCountry,
} from "../../utils/validators.js";

export const useRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation per field (Req 1.3.1)
    let result;
    switch (name) {
      case "username":
        result = validateUsername(value);
        break;
      case "email":
        result = validateEmail(value);
        break;
      case "password":
        result = validatePassword(value);
        // Also revalidate confirm password if it has a value
        if (formData.confirmPassword) {
          const cpResult = validateConfirmPassword(value, formData.confirmPassword);
          setErrors((prev) => ({
            ...prev,
            confirmPassword: cpResult.valid ? "" : cpResult.message,
          }));
        }
        break;
      case "confirmPassword":
        result = validateConfirmPassword(formData.password, value);
        break;
      case "country":
        result = validateCountry(value);
        break;
      default:
        return;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: result.valid ? "" : result.message,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Validate all fields before submit
    const newErrors = {};
    const u = validateUsername(formData.username);
    if (!u.valid) newErrors.username = u.message;
    const em = validateEmail(formData.email);
    if (!em.valid) newErrors.email = em.message;
    const p = validatePassword(formData.password);
    if (!p.valid) newErrors.password = p.message;
    const cp = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (!cp.valid) newErrors.confirmPassword = cp.message;
    const co = validateCountry(formData.country);
    if (!co.valid) newErrors.country = co.message;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const { data } = await registrationService.register(formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/profile");
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.errors) {
        setErrors(resp.errors);
      }
      setServerError(resp?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, serverError, handleChange, handleSubmit };
};