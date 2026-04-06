/**
 * ============================================================================
 * ADMIN SERVICE (The Brain / Business Logic)
 * ============================================================================
 * Purpose: This file contains the core business rules for the Admin module. 
 * It receives clean data from the Controller, performs calculations, enforces 
 * rules, and asks the Repository layer to fetch or save data to MongoDB.
 * * * CRITICAL RULE: A Service must NEVER know about HTTP. 
 * You will never see 'req', 'res', 'next', or 'status(200)' in this file. 
 * If something goes wrong, the Service simply 'throws' an error, and trusts 
 * the Controller to catch it and format the HTTP response.
 */

// Implementation contract:
// 1) Service methods orchestrate repository calls and policy checks.
// 2) Throw AppError for expected failures; let global middleware format output.
// 3) Keep method names action-oriented (listUsers, banUser, unbanUser, etc.).