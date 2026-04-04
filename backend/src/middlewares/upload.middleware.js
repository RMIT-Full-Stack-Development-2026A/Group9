/**
 * ============================================================================
 * UPLOAD MIDDLEWARE (The Security Bouncer)
 * ============================================================================
 * Purpose: Intercepts file uploads from the frontend BEFORE they reach the Controller.
 * It validates the file type, restricts the file size to prevent server crashes,
 * and temporarily stores the file in RAM so we can forward it to Cloudinary.
 */

// --- 1. Storage Configuration ---
// We use memory storage instead of disk storage because we do NOT want to 
// save user images locally on our server's hard drive. We just want to hold 
// the file in RAM temporarily so our Service layer can upload it directly 
// to Cloudinary. This keeps our backend stateless and scalable.

// --- 2. File Filter (Security Check) ---
// This function checks the MIME type (the actual file format) of the upload.
// If a malicious user renames a virus from 'hack.exe' to 'avatar.png', 
// the mimetype check will catch it and block the upload.
// It defines exactly which image formats we accept (e.g., JPEG, PNG, WEBP).
// If the format is allowed, it accepts the file.
// If the format is invalid, it rejects the file and throws a clear error message.

// --- 3. Initialize the Middleware ---
// This configures the multer instance using the storage and filter rules defined above.
// It also sets crucial limits (e.g., limiting the max file size to 5 Megabytes).
// File size limits are absolutely essential for server health to prevent 
// "Denial of Service" (DoS) attacks, where a malicious user uploads a massive 
// file to intentionally overwhelm and crash the server's RAM.

