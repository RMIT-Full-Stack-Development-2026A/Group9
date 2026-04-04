
/**
 * ============================================================================
 * AUTH CONTROLLER (The Receptionist / Front Desk)
 * ============================================================================
 * Purpose: This file handles incoming HTTP requests specifically for the 
 * Authentication module (Logging in, Registering, Logging out). 
 * It acts as the bridge between the Express Routes and the Auth Service.
 * * Key Responsibilities:
 * 1. Extract data from the request (req.body for credentials).
 * 2. Pass that clean data to the AuthService.
 * 3. Receive the generated token and user data from the Service.
 * 4. Send the appropriate HTTP response (200 OK, 201 Created) back to React.
 * 5. Catch any errors (like "Invalid Password") and pass them to next().
 * * CRITICAL RULE: A Controller should NEVER contain bcrypt hashing, JWT 
 * generation, or Mongoose queries. It strictly manages the HTTP flow.
 */