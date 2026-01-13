# Celar — Multichain Payment Orchestration (MNEE Hackathon)

Celar is a **multichain payment orchestration backend** that allows platforms and PSPs to accept stablecoin payments, automatically route them across chains, and track payment state changes in real time.

This submission demonstrates how **MNEE** can be used as a **payment currency** in a real pay-in flow, alongside USDC and USDT, using the same routing, monitoring, and settlement logic.

## What This Project Does

Celar provides:

* A **PSP onboarding API**
* A **Merchant management API**
* A **Pay-in API** to initiate stablecoin payments
* **Automatic route selection** across supported chains (`chain = best`)
* **Deterministic intermediary wallet generation** per payment
* A **listener service** that monitors on-chain transfers
* **Webhook events** for payment lifecycle updates
* **Strict currency validation**, including controlled usage of **MNEE**

## How MNEE Is Used

In this project:

* MNEE can be selected as the `currency` when initiating a pay-in
* The system:

  * resolves the correct MNEE token contract
  * generates a unique intermediary wallet for the payment
  * waits for an on-chain MNEE transfer
  * updates the payment state once funds are received

## Supported Chains & Tokens

| Chain    | Supported Tokens |
| -------- | ---------------- |
| Ethereum | MNEE             |
| Base     | USDC, USDT       |
| Polygon  | USDC, USDT       |
| Arbitrum | USDC, USDT       |
| Testnets | USDC, USDT       |

Availability depends on environment configuration.

## Project Architecture

The project runs as **two services**:

### API Service

* Registers PSPs
* Manages merchants
* Initiates pay-ins
* Resolves routing and token addresses
* Generates intermediary wallets
* Emits webhook events

### Listener Service

* Watches supported blockchains for token transfers
* Confirms incoming payments
* Updates payment status

⚠️ Both services **must be running** for the full flow to work.


## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create your environment file:

```bash
cp .env.example .env
```

Fill in all required variables (RPC URLs, token addresses, webhook secrets, etc.).


### 3. Start the Application

Run the API service:

```bash
npm run dev
```

Run the listener service in a second terminal:

```bash
npm run dev:listener
```

## How to Test the Full Flow

### Step 1: Create a PSP

```bash
curl -X POST http://localhost:3000/api/v1/psps/register \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Acme Payments Ltd",
    "contact_email": "ops@acmepayments.com",
    "registered_country": "KEN",
    "business_type": "llc",
    "primary_use_case": "payments",
    "expected_monthly_volume": "500000-1000000",
    "source_of_funds": "other",
    "license_number": "CBK-PSP-2024-001",
    "website": "https://acmepayments.com"
  }'
```

The response returns an **API key** (shown only once).


### Step 2: Create Merchants

```bash
curl -X POST http://localhost:3000/api/v1/merchants/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PSP_API_KEY>" \
  -d '{
    "merchants": [
      {
        "external_id": "mch_001",
        "name": "Nairobi Electronics",
        "email": "finance@nairobielectronics.co.ke",
        "business_id": "KE-BIZ-001"
      }
    ]
  }'
```

The response returns a `merchant_id` such as:

```
mcht_77aba29815f8f0c3
```


### Step 3: Initiate a Pay-in (MNEE Example)

```bash
curl -X POST http://localhost:3000/api/v1/payments/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PSP_API_KEY>" \
  -d '{
    "merchant_id": "mcht_77aba29815f8f0c3",
    "amount": "120.00",
    "currency": "MNEE",
    "chain": "ethereum",
    "reference": "ORDER-7781",
    "description": "Settlement for order 7781",
    "metadata": {
      "order_id": "ORDER-7781",
      "customer_email": "buyer@example.com"
    }
  }'
```


### What Happens Next

1. The API:

   * resolves the chain and token address
   * generates an intermediary wallet
   * stores routing metadata
2. The response includes:

   * `payment_id`
   * `intermediary_wallet`
   * `token_address`
3. Send the specified token (including **MNEE**) to the intermediary wallet.
4. The listener detects the transfer and confirms the payment.
5. Webhooks (if configured) emit lifecycle events.


## Webhooks

If a webhook URL is configured for the PSP, Celar emits events such as:

* `payin.confirmed`
* `payin.settled`
* `payin.failed`
* `payin.mismatched`

These allow downstream systems to react in real time.


## Documentation

Full API documentation is available at:

👉 **[https://docs.celar.io/](https://docs.celar.io/)**


## Hackathon Functionality Requirements

This project:

* installs successfully using the provided instructions
* runs consistently on the intended platform
* functions as described in this README
* demonstrates **practical usage of MNEE in a real payment flow**
* matches the behavior shown in the demo video


## License

Released under the **MIT License**.
See the `LICENSE` file for details.
