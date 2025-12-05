# CheckedIn – On-Chain Focus & Habit Streaks

CheckedIn is a Solana-powered habit tracker that records your daily focus or study sessions on-chain.  
Each check-in becomes a signed Solana transaction, creating a tamper-evident streak that any app can verify and build on.

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture](#architecture)  
   - [Smart Contract (Solana Program)](#smart-contract-solana-program)  
   - [Web App (Frontend)](#web-app-frontend)  
4. [Solana Tools & Stack](#solana-tools--stack)  
5. [Why Solana?](#why-solana)  
6. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Clone & Install](#clone--install)  
   - [Environment Variables](#environment-variables)  
7. [Running the Project](#running-the-project)  
   - [Local Program + Devnet](#local-program--devnet)  
   - [Running the Web App](#running-the-web-app)  
8. [Program Details](#program-details)  
   - [Accounts](#accounts)  
   - [Instructions](#instructions)  
9. [Frontend Details](#frontend-details)  
   - [UI Flow](#ui-flow)  
   - [Key Components](#key-components)  
10. [Testing](#testing)  
11. [Future Improvements](#future-improvements)  
12. [License](#license)

---

## Overview

CheckedIn demonstrates how simple, everyday actions—like finishing a study session—can be written to Solana as verifiable events.  
Users connect a wallet, check in once per day, and the Solana program enforces streak logic on-chain.

- **Network:** Solana devnet  
- **Smart Contract:** Rust + Anchor  
- **Frontend:** Next.js, TypeScript, Tailwind CSS  

---

## Features

- On-chain daily check-ins (one per calendar day)  
- Automatic streak increment / reset logic at the program level  
- Wallet-based identity: your streak is tied to your Solana address  
- Clean, minimal UI (“CheckedIn”) optimized for quick daily use  
- Devnet-ready demo for hackathons and presentations  

---

## Architecture

High-level architecture:

- **Solana Program (Anchor/Rust)**  
  - Stores user streak state in a PDA derived from `["user-streak", user_pubkey]`.  
  - Enforces business rules: one check-in per day, increment/reset logic.  

- **Web App (Next.js / TypeScript)**  
  - Connects to Phantom and other wallets via Solana Wallet Adapter.  
  - Uses Anchor’s TypeScript client to talk to the on-chain program.  
  - Displays current streak and last check-in date for the connected wallet.

### Smart Contract (Solana Program)

- Framework: **Anchor**  
- Core account: `UserStreak`  
  - `authority: Pubkey` – wallet that owns the streak  
  - `streak: u64` – current streak length  
  - `last_check_in: i64` – last check-in timestamp (or day index)

### Web App (Frontend)

- Framework: **Next.js (App Router)**  
- Styling: **Tailwind CSS**  
- Language: **TypeScript**  
- Wallet Integration: **@solana/wallet-adapter-react** + **@solana/wallet-adapter-wallets**  

---

## Solana Tools & Stack

- **Anchor** – declarative accounts, IDL, migrations, and test runner.  
- **@solana/web3.js** – RPC client, transactions, and PDA derivation.  
- **Solana Wallet Adapter** – plug-and-play browser wallet support.  
- **Solana devnet** – public test network used for this demo.

---

## Why Solana?

- **Low fees & fast finality:** Ideal for daily micro-transactions like check-ins.  
- **Account model:** PDAs make it easy to map “one user → one streak account”.  
- **Mature dev tooling:** Anchor and wallet adapter significantly reduce boilerplate.  
- **Composability:** Other Solana programs can later read streak data for reputation, rewards, or gating.

---

## Getting Started

### Prerequisites

- Node.js (LTS)  
- Yarn or pnpm or npm  
- Rust + Cargo  
- Solana CLI  
- Anchor CLI  
- A Solana wallet (e.g., Phantom) configured for **devnet**


Backend: https://github.com/DanielG6205/mbc-checkedin-anchor
