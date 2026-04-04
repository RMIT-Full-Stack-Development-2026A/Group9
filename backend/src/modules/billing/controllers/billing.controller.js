/**
 * ============================================================================
 * BILLING CONTROLLER (The Financial Receptionist)
 * ============================================================================
 * Purpose: This file handles incoming HTTP requests related to money, 
 * subscriptions, and transactions. It acts as the bridge between the Express 
 * Routes and the Billing Service.
 * * Key Responsibilities:
 * 1. Extract payment data or user IDs from the request.
 * 2. Pass that data to the Billing Service to process the logic.
 * 3. Send the appropriate HTTP response (e.g., 200 OK, 402 Payment Required).
 * 4. Catch errors (like "Card Declined") and pass them to next().
 * * CRITICAL RULE: A Controller should NEVER contain third-party API keys 
 * (like Stripe/PayPal secrets), complex math for tax calculation, or database 
 * queries. It strictly manages the HTTP flow.
 */