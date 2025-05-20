# 💸 Donate Now – Blockchain-Based Donation Platform

**Donate Now** is a secure, transparent, and decentralized donation platform built using blockchain technology. It allows users to contribute ETH (Ethereum cryptocurrency) to verified charitable campaigns through smart contracts, ensuring complete transparency and integrity in transactions.

## 🌟 Highlights

- 🛡 Secure donations using Ethereum smart contracts
- 🔗 Transparent and traceable contributions
- 👛 MetaMask wallet integration for ETH donations
- 🧾 Verified campaigns approved by admin before fundraising
- 🔄 Smart fund release upon campaign success
- 📊 Campaign progress with live tracking

---

## 📦 Tech Stack

| Layer               | Technology                 |
|---------------------|----------------------------|
| **Smart Contract**  | Solidity (via Remix IDE)   |
| **Blockchain**      | Ethereum (Testnet / Ganache) |
| **Interaction**     | ethers.js                  |
| **Frontend**        | Next.js, Tailwind CSS      |
| **Backend**         | Node.js, Express.js        |
| **Database**        | MongoDB with Prisma ORM    |
| **Auth**            | JWT (accessToken + refreshToken) |
| **Wallet**          | MetaMask Integration       |

---

### 🧩 Functions

- `createCampaign(name, recipient, goal)`
  - Admin-only: Creates a new campaign.
- `donate(campaignId)`
  - Public: Allows users to donate ETH to a campaign.
- `releaseFunds(campaignId)`
  - Admin-only: Releases funds to recipient if the goal is met.
- `getCampaignDetails(campaignId)`
  - Returns campaign info (name, goal, amount raised, completion status).

### 🔐 Security Measures

- `onlyOwner` modifier for admin-only actions
- Prevents fund re-release with `isCompleted` flag
- Tracks donations by storing donor address, amount, and timestamp

---

## 🧑‍💼 User Roles & Features

### 👤 Donor
- Browse campaigns
- Donate via MetaMask
- View donation history

### 🧑‍💼 Organizer
- Submit campaigns for approval
- Track fundraising progress

### 🛡 Admin
- Approve or reject campaigns
- Release funds on goal achievement
- View all users and donations

---
