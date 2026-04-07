/**
 * ============================================================================
 * LOGIN ATTEMPT SERVICE (The Security Sentinel)
 * ============================================================================
 * Purpose: This file manages the logic for tracking and limiting login 
 * attempts in TicTacToang. It is the primary defense against "Brute Force" 
 * attacks, where a malicious bot tries thousands of passwords to break 
 * into a player's account.
 * * Key Responsibilities:
 * 1. Tracking: Recording every failed login attempt by IP or Username.
 * 2. Rate Limiting: "Cooling down" an account after X failed attempts.
 * 3. Lockout Logic: Temporarily disabling login for a specific user.
 * 4. Cleanup: Removing old, successful, or expired attempt records.
 * * CRITICAL RULE: This service should be "Fast and Lightweight." It is 
 * called every time someone tries to log in, so it must not slow down 
 * the legitimate user experience.
 */