/**
 * ============================================================================
 * PAYMENT MODULE ENTRY POINT (The Storefront Gateway)
 * ============================================================================
 * Location: src/modules/payment/index.js
 * Purpose: This file acts as the public interface for the Payment module.
 * It centralizes the tools needed for "TicTacToang" monetization, including
 * premium skins, XP boosts, and season passes.
 * * Key Responsibilities:
 * 1. Component Export: Making the PaymentForm available for checkout modals.
 * 2. Hook Export: Providing usePayment for managing transaction states.
 * 3. Service Export: Exposing paymentService for currency formatting and history.
 * 4. Security: Isolating sensitive payment processing logic from the core game.
 */

export { default as PaymentForm } from "./components/PaymentForm/PaymentForm.jsx";

export { default as usePayment } from "./hooks/usePayment.js";

export * as paymentService from "./services/payment.service.js";