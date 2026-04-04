/**
 * ============================================================================
 * MASTER ROUTER (The API Directory)
 * ============================================================================
 * Purpose: This file aggregates all individual feature routes into a single 
 * entry point. It acts as the central "switchboard" for the application.
 * By keeping this here, our main app.js file stays incredibly clean.
 */

// --- 1. Import Feature Routes ---
// Here we import the specific route files exported by each individual module.
// Example: import authRoutes from './auth/routes/auth.route.js';
// Example: import gameRoutes from './game/routes/game.route.js';

// --- 2. Mount Routes to Base Endpoints ---
// We attach each imported route to its specific base URL path.
// When a user makes a request, this master router intercepts it and 
// hands it off to the correct module based on the URL prefix.
// Example: router.use('/auth', authRoutes); 
//          ^ (Directs all '.../auth/login' or '.../auth/register' traffic to the auth module)
// Example: router.use('/games', gameRoutes);
//          ^ (Directs all '.../games/history' traffic to the game module)

// --- 3. API Health Check (Best Practice) ---
// It is highly recommended to build a simple GET route (e.g., '/health') right here.
// This allows external services (like AWS, Docker, or a frontend health dashboard) 
// to quickly ping the server and verify that the API is alive and running smoothly.

// --- 4. Export the Master Router ---
// Finally, we export this single combined router. 
// This means your main server file (app.js) only has to import THIS one file 
// to magically load the entire API, usually mounting it under a versioned 
// path like: app.use('/api/v1', masterRouter);