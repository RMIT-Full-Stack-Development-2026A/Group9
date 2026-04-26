# Premium Subscription & Payments — Complete Guide

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Architecture](#architecture)
4. [API Reference](#api-reference)
5. [Environment Setup](#environment-setup)
6. [Running the Feature](#running-the-feature)
7. [Testing the Full Flow](#testing-the-full-flow)
8. [Stripe Webhook Setup (Local Dev)](#stripe-webhook-setup-local-dev)
9. [Troubleshooting](#troubleshooting)

---

## Overview

TicTacToang Premium costs **$10/month** and gives users two additional features:

| Feature | Free | Premium |
|---------|------|---------|
| Match replay (pause/resume/forward/backward) | ✗ | ✓ |
| Advanced ranking system | ✗ | ✓ |

There are **two ways to pay**:

| Method | How it works |
|--------|-------------|
| **Wallet** | Top up your in-app wallet with any amount, then click Subscribe |
| **Stripe** | Pay directly with a credit/debit card via Stripe Checkout |

Both methods activate premium for **30 days** from your current expiry (subscriptions stack — paying again extends your time).

---

## How It Works

### Payment Flow Diagrams

#### Wallet Payment Flow

```
User deposits money → walletBalance increases
User clicks "Subscribe ($10)" → $10 deducted → premiumUntil set +30 days → email sent
```

```
[Frontend: Payment.jsx]
  ├─ Deposit amount entered → POST /api/billing/wallet/deposit
  │    └─ billingService.depositToWallet() → addToWallet() → Transaction(deposit, completed)
  │
  └─ Subscribe button clicked → POST /api/billing/subscribe/wallet
       ├─ Check balance >= $10
       ├─ deductFromWallet($10)
       ├─ setPremiumUntil(now + 30 days)  [stacks if already premium]
       ├─ Transaction(subscription, completed)
       └─ sendPaymentEmail(user.email) → Gmail SMTP
```

#### Stripe Payment Flow

```
User clicks "Pay with Stripe" → Stripe Checkout page → user pays → webhook fires → premium activated → email sent
```

```
[Frontend: Payment.jsx]
  └─ Stripe button clicked → POST /api/billing/checkout/stripe
       ├─ stripe.checkout.sessions.create({ metadata: { userId } })
       ├─ Transaction(subscription, pending)
       └─ Returns { checkoutUrl } → browser redirects to Stripe

[Stripe Servers]
  └─ User completes payment on Stripe page
       └─ POST /api/billing/webhook/stripe  (checkout.session.completed)
            ├─ Verify HMAC signature (STRIPE_WEBHOOK_SECRET)
            ├─ Extract userId from session.metadata
            ├─ setPremiumUntil(now + 30 days)  [stacks]
            └─ sendPaymentEmail(user.email)
```

### Premium Stacking

If a user already has premium and subscribes again, their expiry **extends** from the current end date rather than reset:

```
Today: Apr 19 — already premium until May 10
Subscribe again → premium until Jun 9   (30 days after May 10, not after Apr 19)
```

---

## Architecture

The billing feature follows the full N-Tier/Modular Monolith design:

```
backend/src/modules/billing/
├── index.js                  ← Module registration (exports registerBillingModule)
├── models/
│   └── transaction.model.js  ← MongoDB schema: { userId, type, amount, status, description }
├── repositories/
│   └── billing.repository.js ← Raw DB operations: createTransaction, addToWallet, setPremiumUntil …
├── services/
│   └── billing.service.js    ← Business logic: depositToWallet, subscribeWithWallet, handleStripeWebhook …
├── controllers/
│   └── billing.controller.js ← HTTP handlers (thin, delegates to service)
├── routes/
│   └── billing.route.js      ← Express router, mounted at /api/billing
└── dto/
    └── billing.dto.js        ← Response shaping: toTransactionResponse, toWalletResponse

frontend/src/modules/payment/
├── pages/Payment.jsx         ← "Go Premium" UI (wallet card + Stripe card)
├── hooks/usePayment.js       ← State management: wallet balance, deposit, subscribe, Stripe redirect
└── services/payment.service.js ← Axios calls to billing API
```

**Premium data is stored on `UserProfile`** (not a separate collection):
- `UserProfile.walletBalance` — current USD balance
- `UserProfile.premiumUntil` — ISO date, `null` if not premium

**Transactions** are stored in the `Transactions` MongoDB collection.

---

## API Reference

All authenticated endpoints require `Authorization: Bearer <accessToken>`.

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| `GET` | `/api/billing/wallet` | ✓ | — | Get wallet balance + premiumUntil |
| `POST` | `/api/billing/wallet/deposit` | ✓ | `{ "amount": 50 }` | Add funds to wallet |
| `POST` | `/api/billing/subscribe/wallet` | ✓ | — | Subscribe using wallet balance |
| `POST` | `/api/billing/checkout/stripe` | ✓ | — | Create Stripe Checkout session |
| `POST` | `/api/billing/webhook/stripe` | ✗ | raw body | Stripe webhook receiver |
| `GET` | `/api/billing/transactions` | ✓ | — | List transaction history |

### Example Responses

**GET /api/billing/wallet**
```json
{
  "success": true,
  "data": {
    "walletBalance": 40,
    "premiumUntil": "2026-05-19T09:11:44.065Z"
  }
}
```

**POST /api/billing/wallet/deposit** `{ "amount": 50 }`
```json
{
  "success": true,
  "data": {
    "transaction": {
      "_id": "...",
      "type": "deposit",
      "amount": 50,
      "status": "completed",
      "description": "Wallet deposit of $50",
      "createdAt": "2026-04-19T09:10:19.868Z"
    },
    "walletBalance": 50
  }
}
```

**POST /api/billing/subscribe/wallet**
```json
{
  "success": true,
  "data": {
    "transaction": { "type": "subscription", "amount": 10, "status": "completed", ... },
    "walletBalance": 40,
    "premiumUntil": "2026-05-19T09:11:44.065Z"
  }
}
```

**POST /api/billing/checkout/stripe**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```

---

## Environment Setup

### Backend `.env` (required variables)

```env
# ── MongoDB ──────────────────────────────────────────────────────────
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/Group9Clean

# ── Auth ─────────────────────────────────────────────────────────────
JWT_SECRET=your_jwt_secret

# ── Stripe ───────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_51...          # From https://dashboard.stripe.com/test/apikeys
STRIPE_WEBHOOK_SECRET=whsec_...          # From Stripe CLI output (see below)

# ── Email (Gmail SMTP) ───────────────────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx          # Gmail App Password (not your login password)

# ── App ──────────────────────────────────────────────────────────────
CLIENT_URL=http://localhost:5173         # Frontend URL (used in Stripe redirect URLs)
PORT=3000
```

### How to get a Gmail App Password

1. Enable **2-Step Verification** on your Google account
2. Go to `myaccount.google.com` → Security → **App passwords**
3. Create a password for "Mail / Windows Computer"
4. Copy the 16-character password (with spaces) into `EMAIL_PASS`

### How to get a Stripe Test API Key

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy **Secret key** (`sk_test_...`) into `STRIPE_SECRET_KEY`
3. The webhook secret comes from the Stripe CLI (see [Stripe Webhook Setup](#stripe-webhook-setup-local-dev))

---

## Running the Feature

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start the Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running at http://localhost:3000
MongoDB connected
Connected to DB: Group9Clean
```

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173` (or `5174` if 5173 is busy).

### 4. Start the Stripe Webhook Listener (for local development)

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook/stripe
```

Expected output:
```
> Ready! Your webhook signing secret is whsec_70c1d8dd...
```

Copy this `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `backend/.env` (restart the backend after editing `.env`).

---

## Testing the Full Flow

### Option A — Wallet Payment (via API, no browser needed)

**Step 1: Register an account**
```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/auth/register" `
  -ContentType "application/json" `
  -Body '{"username":"TestUser","email":"test@example.com","password":"Test@1234","country":"Vietnam"}'
```
Save the `accessToken` from the response.

**Step 2: Deposit money**
```powershell
$token = "<paste accessToken here>"
$h = @{ Authorization = "Bearer $token" }

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/billing/wallet/deposit" `
  -Headers $h -ContentType "application/json" `
  -Body '{"amount":50}' | ConvertTo-Json
```

**Step 3: Subscribe**
```powershell
Invoke-RestMethod -Method Post `
  -Uri "http://localhost:3000/api/billing/subscribe/wallet" `
  -Headers $h -ContentType "application/json" | ConvertTo-Json
```

You should get `premiumUntil` set 30 days out, and a confirmation email arrives at your registered address.

**Step 4: Check wallet**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/billing/wallet" -Headers $h | ConvertTo-Json
```

---

### Option B — Stripe Payment (browser)

1. Open `http://localhost:5173` and log in
2. Click **Go Premium** on the home page (or navigate to `/payment`)
3. Click **Pay with Stripe ($10)**
4. You are redirected to Stripe Checkout — use test card:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: any future date (e.g. `12/30`)
   - **CVC**: any 3 digits (e.g. `123`)
   - **Name/address**: anything
5. After payment, Stripe sends `checkout.session.completed` to the webhook listener
6. Backend sets `premiumUntil` and sends email
7. Browser redirects to `/profile?tab=wallet&payment=success`

---

### Option C — Stripe CLI Trigger (simulate webhook without browser)

After setting up the stripe listener, run:

```bash
stripe trigger checkout.session.completed
```

> **Note:** CLI-triggered events use generic Stripe test data and do **not** carry your real `userId` in metadata — so premium will not be activated for any specific user. This only confirms webhook routing and signature verification work correctly. Use Option B for a full end-to-end test.

---

### Verifying Email Delivery

When a wallet subscription or Stripe payment completes, watch the backend console for:

```
[EMAIL DEBUG] Sending payment confirmation FROM: "TicTacToang" <helloworldwh8766918@gmail.com> TO: user@example.com
[EMAIL DEBUG] Email sent successfully to user@example.com
```

If this appears, the email was dispatched. Check the inbox (and Spam folder) of the registered email address.

---

## Stripe Webhook Setup (Local Dev)

### Install Stripe CLI

**Windows (Chocolatey)**
```bash
choco install stripe-cli
```

**Windows (Scoop)**
```bash
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

**Verify**
```bash
stripe --version
```

### Login to Stripe

```bash
stripe login
```

This opens a browser to authenticate your Stripe account.

### Start the Listener

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook/stripe
```

Copy the `whsec_...` from the output into `backend/.env` as `STRIPE_WEBHOOK_SECRET`, then restart the backend.

### Verify Webhook Connectivity

All events forwarded to your backend return `[200]` in the Stripe CLI output:
```
--> checkout.session.completed [evt_1...]
<-- [200] POST http://localhost:3000/api/billing/webhook/stripe [evt_1...]
```

---

## Troubleshooting

### `Insufficient wallet balance`
The wallet balance is below $10. Deposit more funds first.

### `Stripe is not configured` (503)
`STRIPE_SECRET_KEY` is missing or empty in `backend/.env`.

### `Webhook secret not configured` (503)
`STRIPE_WEBHOOK_SECRET` is missing. Start `stripe listen` and copy the `whsec_...` value.

### `Webhook signature verification failed` (400)
The `STRIPE_WEBHOOK_SECRET` in `.env` doesn't match the one printed by `stripe listen`. Re-copy the value and restart the backend.

### Email not received
1. Check backend logs for `[EMAIL DEBUG]` lines
2. Check Spam/Junk folder
3. Confirm `EMAIL_USER` and `EMAIL_PASS` are set in `.env`
4. Ensure the Gmail App Password is correct — it must be a 16-character App Password, **not** your Google login password

### Stripe transaction stuck as `pending`
The `checkout.session.completed` webhook was never received. Ensure:
- `stripe listen` is running
- `STRIPE_WEBHOOK_SECRET` matches the CLI output
- Backend is running on port 3000
- You used the real checkout URL (Option B), not `stripe trigger`

### `CLIENT_URL` mismatch — wrong redirect after Stripe payment
Ensure `CLIENT_URL` in `.env` matches the actual frontend origin (e.g. `http://localhost:5174` if Vite used port 5174 instead of 5173).
