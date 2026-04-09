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