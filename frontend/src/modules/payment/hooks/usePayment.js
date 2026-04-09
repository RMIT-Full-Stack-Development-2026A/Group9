/**
 * ============================================================================
 * USE PAYMENT HOOK (The Transaction Controller)
 * ============================================================================
 * Location: src/modules/payment/hooks/usePayment.js
 * Purpose: This hook manages the lifecycle of a "Toang" transaction. 
 * It handles the sensitive state transition from "Cart" to "Confirmed".
 * * Key Responsibilities:
 * 1. Transaction Flow: Orchestrating the call to the payment gateway.
 * 2. Processing State: Providing a 'loading' flag to disable UI buttons.
 * 3. Error Catching: Translating banking errors into human-readable messages.
 * 4. Success Handling: Confirming receipt of the "Toang" Gold or Skin.
 */