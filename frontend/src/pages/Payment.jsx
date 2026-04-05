/**
 * ============================================================================
 * PAYMENT PAGE (The Premium Checkout)
 * ============================================================================
 * Location: src/pages/Payment.jsx
 * Purpose: This page handles financial transactions for TicTacToang, such 
 * as buying "Toang Coins," premium avatars, or an "Ad-Free" pass. It 
 * integrates with the Payment module to handle secure Stripe/PayPal flows.
 * * Key Responsibilities:
 * 1. Product Selection: Displaying the available "Toang" bundles.
 * 2. Checkout Integration: Wrapping the Stripe 'Elements' or PayPal buttons.
 * 3. Transaction Feedback: Handling 'Success', 'Canceled', or 'Failed' states.
 * 4. Security: Ensuring no sensitive credit card data touches our local state.
 */