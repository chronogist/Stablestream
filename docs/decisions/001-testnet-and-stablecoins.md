# ADR-001: Polygon Amoy testnet and USDC as default stream token

## Status

Accepted — March 2026

## Context

StableStreams needs a testnet where users can create real on-chain payment streams without mainnet cost. The dashboard must support at least one stablecoin so employers can model payroll-like flows.

## Decision

1. **Deploy and test on Polygon Amoy** instead of Ethereum Sepolia or Base Sepolia.
2. **Use Amoy USDC** (`0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582`) as the primary demo token in the UI.
3. **Keep native ETH streaming** as a secondary path for developers who want to test without faucet stablecoins.

## Rationale

### Why Polygon Amoy (not Sepolia)

- Our streaming contract is already deployed on Amoy (`0xa163743e196D2328Ce619F6B911ED24B7F42c824`).
- Amoy faucets and USDC test tokens are easier for demo users than sourcing Sepolia ETH for every stream.
- Polygon's low fees better match the "continuous micro-payment every second" UX — high L1 gas would distort the product story.

### Why USDC over DAI for the default UI

- USDC is what most payroll-minded users ask for first when we demo "pay contractors in stablecoins."
- Amoy USDC address is verified on our deployment; DAI on Amoy is documented as an example only and not the happy path.
- Reduces support burden: one default token in Create Stream flows.

### Tradeoffs accepted

- **Amoy is not mainnet** — we must re-audit before pointing production users at the same contract address.
- **Single-chain focus for MVP** — multi-chain stream aggregation on the dashboard is deferred.
- **Centralized stablecoin risk** — acceptable for testnet demos; mainnet will document issuer risk in user-facing copy.

## Consequences

- `src/config/contract.js` lists Amoy USDC as the primary `TEST_TOKENS.USDC` entry.
- README and onboarding assume Polygon Amoy in wallet network prompts.
- Future mainnet launch requires a new ADR for chain + token selection.