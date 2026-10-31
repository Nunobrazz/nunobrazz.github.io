---
title: "Concordia - Canton Allocation Primitives"
excerpt: "An open-source Daml interface library for privacy-preserving, multi-party allocation and decision workflows on the Canton Network."
collection: portfolio
date: 2026-06-11
project_category: "Projects"
github_url: "https://github.com/unlockitio/concordia"
---

Concordia is the reference implementation of **Canton Allocation Primitives (CAP)**, an open-source [Daml](https://docs.daml.com) library for privacy-preserving, multi-party allocation and decision workflows on the [Canton Network](https://www.canton.network). It targets coordination problems where multiple parties submit private inputs, a rule resolves those inputs into an outcome, and the outcome triggers a downstream action, atomically and with on-ledger authority. Auctions and governance are the two worked instances.

## Architecture

- **`cap-core`**: domain-agnostic stored types and helpers for checked fetches, resolutions, admission and time windows.
- **`cap-governance`**: `Action` and `Executable` interfaces, plus ballots, weighted voting rights, quorums and tallies (plurality, unanimity, share of votes, weighted median).
- **`cap-auctions`**: bid and settlement interfaces that compose with the Canton Token Standard for funding and settlement.

## Reference implementations

- **Private majority vote**: ballots stay private between each voter and the resolver.
- **Sealed-bid first-price auction**: bids stay private until resolution, with settlement through Token Standard allocations.
- **Weighted DSO governance**: a Splice-style governance flow with weighted votes and execution checks on approved proposals.

Each runs as Daml Script and against a Canton sandbox.

🚧 **Status: Active development (pre-release)**
