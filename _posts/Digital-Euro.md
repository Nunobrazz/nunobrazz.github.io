---
title: 'Digital Euro'
date: 2025-10-15
permalink: /posts/2025/CBDC/
tags:
  - Digital Euro
  - SEPA
  - Banking
---

I will start this post by explaining what is a Central Bank Digital Currency. To do so, I will explain what is a Digital Curency.

What is a Digital Currency ?
======

Accorgin to Barata [1] a currency is "any asset that constitutes an immediate form of settling debts, with general acceptability and immediate availability". The same author makes the distinction that money consists of banknotes and coins admitted into circulation. The first definition does not imply currency to be a matererial good. With tha said one can thing about money as the expression of a currency. A currency has the follwing roles in the economy: (1) Medium of Exchange, (2) Unit of account, (3) Store of Value. 


Current solutions to move money
======

Today, people’s money is stored digitally in bank databases. Transfering money between banks is not straightforward, as banks must at least agree on message formats and account identification. To solve this, standardized systems were created to handle payments across banks and countries. For example, SWIFT is used for international transfers, and SEPA is used for payments within Europe. SEPA allows for four euro payment schemes:

  * Credit Transfer (SCT) [Rulebook](https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-09/EPC125-05%202025%20SCT%20Rulebook%20version%201.1.pdf): The originator instructs their bank to transfer an amount of money directly to the beneficiary's bank account.

  * Direct Debit Core (SDD)[Rulebook](https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-10/EPC016-06%202025%20SDD%20Core%20Rulebook%20version%201.1.pdf): Allows creditors to collect payments from debtors' accounts with prior authorization.

  * Business-to-Business [Rulebook](https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2024-11/EPC222-07%202025%20SDD%20B2B%20Rulebook%20version%201.0.pdf): Allows creditors to collect payments from debtors' accounts with prior authorization, tailored for business-to-business.

  * Instant Credit Transfer (SCT Inst) [Rulebook](https://www.europeanpaymentscouncil.eu/sites/default/files/kb/file/2025-10/EPC004-16%202025%20SCT%20Instant%20Rulebook%20v1.1.pdf): Instant credit transfer.

The Instant Property is acheived by using a dedicated real-time clearing and settlement infrastructure. (Explain how they work)

The Digital Euro's Technical Architecture: A UTXO-Based Approach
======

UTXO in Bitcoin vs the Digital Euro
------

The UTXO (Unspent Transaction Output) model is a way of tracking ownership of digital value. The ledger does not store account balances directly — instead, it records individual "coins" called unspent outputs. Each output represents a specific amount of value and is locked to a specific owner through a cryptographic condition: only the holder of the corresponding private key can spend it. A user's balance is therefore not an entry in the ledger but rather the sum of all unspent outputs locked to their key. To consult their funds, a user's wallet software scans the ledger and aggregates all UTXOs associated with their address.

When a user wants to make a payment, they consume one or more of their unspent outputs as inputs and produce new outputs: one locked to the recipient's address and, if the inputs exceed the payment amount, one returning the change to themselves. Each output can only be spent once, which prevents double-spending. This model was introduced by Bitcoin [2] and is also used by other systems such as Cardano and Zcash.

In Bitcoin, the UTXO model operates in a fully decentralized and permissionless environment. New coins are minted through mining, and users are identified only by pseudonymous public keys — anyone can create an address and transact without revealing their identity. No central authority controls issuance, supply, or who can participate.

The ECB's Digital Euro adapts the UTXO concept under fundamentally different assumptions. The European Central Bank is the sole issuer: it mints and redeems digital euro tokens, maintaining full control over the monetary supply. Users are not pseudonymous — each digital euro account is tied to a verified identity through a Digital Euro Account Number (DEAN) or an alias such as a phone number, managed by supervised Payment Service Providers (PSPs) [3]. Furthermore, policy constraints are enforced at the system level: individual users are subject to holding limits, and business users have a holding limit of zero, meaning all incoming digital euros are automatically converted to commercial bank money via a waterfall mechanism [3]. These design choices reflect the ECB's goal of providing a digital form of public money that preserves monetary sovereignty while complying with regulatory requirements such as anti-money laundering (AML) and know-your-customer (KYC) obligations.

Settlement and Clearing
------



What brings different
------

What is China doing ?
------


Possible applications
------

References
======

[1] Moeda e Mercados Financeiros, José Martins Barata

[2] S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System," 2008.

[3] European Central Bank, "Digital Euro Scheme Rulebook," Draft v0.9, June 2025.