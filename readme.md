# Celar — Multichain Payment Orchestration

*MNEE Hackathon Submission*

Celar is a **multichain payment orchestration backend** designed for platforms and Developers to accept stablecoin payments, route them across chains, and track payment state changes in real time.

This submission demonstrates MNEE in a real pay-in flow, operating alongside USDC and USDT using the same routing, monitoring, and settlement infrastructure.

## What This Project Does

Celar provides the following core capabilities:

* **PSP onboarding API**
* **Merchant management API**
* **Pay-in API** for stablecoin payments
* **Automatic route selection** across supported chains (`chain = best`)
* **Deterministic intermediary wallet generation** per payment
* **On-chain listener service** for transfer detection
* **Webhook events** for payment lifecycle updates


## How MNEE Is Used

In this project:

* **MNEE** can be selected as the `currency` when initiating a pay-in.
* The platform then:

  * resolves the correct MNEE token contract
  * generates a unique intermediary wallet for the payment
  * monitors the chain for an incoming MNEE transfer
  * updates payment state once funds are received and confirmed

## Supported Chains & Tokens

| Chain    | Supported Tokens |
| -------- | ---------------- |
| Ethereum | MNEE             |
| Base     | USDC, USDT       |
| Arbitrum | USDC, USDT       |
| Testnets | USDC, USDT       |

> Availability depends on environment configuration and network setup.

## Project Architecture

Celar runs as **two cooperating services**, both required for end-to-end operation.

### API Service

Responsible for:

* PSP registration
* Merchant management
* Pay-in initiation
* Chain and token resolution
* Intermediary wallet generation
* Webhook emission

### Listener Service

Responsible for:

* Monitoring supported blockchains
* Detecting incoming token transfers
* Confirming payments
* Updating payment state

> Both services **must be running** for the full payment flow to function correctly.


## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create an environment file:

```bash
cp .env.example .env
```

Populate all required variables, including:

* RPC URLs
* Token contract addresses
* Webhook secrets
* Chain configuration values

### 3. Start the Services

Run the API service:

```bash
npm run dev
```

Run the listener service in a separate terminal:

```bash
npm run dev:listener
```

### ⚠️ Important Note on Testing
> The steps below use Celar’s hosted API environment.
> By following this method, you are running the full pay-in flow against the live hosted backend, including routing, smart wallet generation, on-chain listening, and settlement logic.
>
> No local services are required to test this flow.

## How to Test the Full Pay-In Flow

1. Create an account on the dashboard:
   **[https://dashboard.celar.io](https://dashboard.celar.io)**

2. Select the **PSP onboarding flow** during KYC.
   (For the hackathon environment, approval is automatic.)

3. Create a **customer** and copy the `customer_id`.

4. Create an **internal Celar wallet** for receiving a pay-in.

5. Generate an **API key** and configure a **webhook URL** in settings.

6. Initiate a pay-in using the API:
   **[https://docs.celar.io/api#/operations/create_payin](https://docs.celar.io/api#/operations/create_payin)**

7. The response returns:

   * `payment_id`
   * `intermediary_wallet`
   * `token_address`

8. Send the specified MNEE token to the intermediary wallet.

9. Wait for confirmation. Once processed, the payment state updates automatically.


## What Happens Internally

1. The API:

   * resolves chain and token metadata
   * generates a deterministic intermediary wallet
   * stores routing context
2. The listener:

   * detects the on-chain transfer
   * validates amount and currency
   * confirms the payment
3. Webhooks (if configured) emit lifecycle events in real time.


## Webhooks

If a webhook URL is configured for the PSP, Celar emits events such as:

* `payin.confirmed`
* `payin.settled`
* `payin.failed`
* `payin.mismatched`

These allow downstream systems to react programmatically to payment state changes.


## Documentation

Full API documentation is available at:

**[https://docs.celar.io/](https://docs.celar.io/)**

## Hackathon Requirements

This submission:

* installs using the provided instructions
* runs reliably in the intended environment
* functions as described in this README
* demonstrates **practical MNEE usage in a real payment flow**
* matches the behavior shown in the demo video

## License

Released under the **MIT License**.
See the `LICENSE` file for details.
