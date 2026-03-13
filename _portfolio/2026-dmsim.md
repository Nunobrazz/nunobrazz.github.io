---
title: "DMsim — Decision Making Simulator"
excerpt: "A Python simulator for comparing Decision Markets and VCG auctions as collective decision-making mechanisms, powered by LLM-generated agents."
collection: portfolio
date: 2026-01-01
---

**How do you get a group of people — each with their own interests and private information — to make a good collective decision?**

Think of a DAO voting on a risky proposal. Some members want it approved because they'll profit. Others think it's too dangerous. Nobody shares the full picture. DMsim lets you test two fundamentally different answers to this problem.

[View on GitHub](https://github.com/Nunobrazz/dmsim)

## The Two Mechanisms

### 🏦 Decision Markets
Agents trade shares on outcomes — like a mini stock market. The price of each share reflects the crowd's collective belief about what will happen, and the market's recommended action is simply whichever option the crowd bets will succeed.

> Nobody tells you the truth. The market price reveals it.

### 🗳️ VCG with Rewards (VCGR)
Each agent submits a single number representing how much they value one option over another. A clever payment rule — the *pivot mechanism* — makes truth-telling the individually rational strategy. No coordination required.

> Honesty isn't altruism. It's the dominant strategy.

## LLM-Generated Agents

DMsim uses a large language model (Google Gemini or Groq) to generate a cast of realistic, conflicted participants. Each agent gets a name, a role, and a financial stake in each possible outcome — and the LLM builds their preferences to reflect both personality and self-interest.

The result feels much closer to a real governance vote than a random sample. Context and personalities are fully customizable.

