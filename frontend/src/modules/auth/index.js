/**
 * ============================================================================
 * AUTH MODULE ENTRY POINT (The Public API)
 * ============================================================================
 * Location: src/modules/auth/index.js
 * Purpose: This file acts as the "Barrel Export" for the entire Auth module.
 * It defines exactly what is visible to the rest of the application and 
 * hides internal implementation details.
 * * Key Responsibilities:
 * 1. Clean Exports: Allowing other pages to import { LoginForm } from '@/modules/auth'.
 * 2. Encapsulation: Keeping 'LoginForm.module.css' or private helper functions 
 * hidden inside the module folder.
 * 3. Namespace Management: Preventing naming collisions across the app.
 */

export { default as LoginForm } from "./components/LoginForm/LoginForm.jsx";
export { default as RegistrationForm } from "./components/RegistrationForm/RegistrationForm.jsx";

export { default as useLogin } from "./hooks/useLogin.js";
export { default as useRegistration } from "./hooks/useRegistration.js";

export * as authService from "./services/auth.service.js";