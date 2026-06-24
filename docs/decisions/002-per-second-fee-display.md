# ADR-002: Per-second fee display instead of per-block estimates

## Status

Accepted — June 2026

## Context

Users creating streams on StableStreams were confused by gas estimates shown as "per transaction" or "per block" — that misrepresents a product where value moves every second. Support questions kept asking why the UI showed a one-time fee when the tagline promises continuous streaming.

## Decision

1. **Show streaming cost as an estimated per-second rate** in the Create Stream preview (Amoy gas × tick frequency).
2. **Remove the old per-block fee callout** from the confirmation step — it implied a single upfront charge.
3. **Add a footnote** linking to ADR-001: low Amoy fees are why per-second UX is honest on testnet.

## Rationale

### Why per-second (not per-block)

- Matches mental model: "I am paying someone continuously" not "I am submitting one big transaction."
- Polygon Amoy gas is low enough that per-second numbers stay readable (fractions of a cent in test USDC terms).
- Per-block estimates were technically correct for the keeper tick but **misleading for demos** — prospects thought streaming was expensive.

### What we considered and rejected

- **Hide fees entirely** — rejected; payroll buyers want transparency even on testnet.
- **Show only total stream duration cost** — rejected; users compare products by ongoing burn rate, not lump sum.
- **Switch to Sepolia for "familiar" gas semantics** — rejected per ADR-001; high L1 fees would make per-second display look alarming.

## Tradeoffs accepted

- Per-second estimate varies slightly with network congestion — we show "~" and refresh on wallet reconnect.
- More UI copy to maintain when we add multi-chain.
- Testnet numbers are not a mainnet quote — must label "estimate on Amoy."

## Consequences

- Create Stream preview shows `~X USDC/sec` (derived from contract tick + current gas price).
- Old `estimateBlockFee()` helper deprecated in favor of `estimatePerSecondRate()`.
- Demo scripts updated to mention per-second framing in pitches.