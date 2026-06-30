# CertVerify — Blockchain-Based Academic Certificate Verification

A full-stack system for issuing and verifying academic certificates anchored on the Ethereum blockchain. Certificate data is hashed with SHA-256 and written to a Solidity smart contract on Sepolia testnet. Anyone can verify a certificate's authenticity in real time — no account required.

## Stack

| Layer | Technology |
|---|---|
| Smart contract | Solidity ^0.8.19, Hardhat |
| Backend | Node.js, Express, Mongoose, web3.js, JWT |
| Database | MongoDB |
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Network | Ethereum Sepolia testnet |

## Project structure

```
/contracts          CertificateRegistry.sol
/test               Hardhat contract tests
/scripts            deploy.js, seed.js
/backend/src        Express API (config, models, services, controllers, routes, middleware)
/frontend/src       React app (pages, components, api client, AuthContext)
```

## Setup

### 1. Prerequisites
- Node.js LTS
- MongoDB running locally (or Atlas URI)
- MetaMask relayer wallet + Sepolia ETH (via faucet)
- Alchemy or Infura RPC endpoint

### 2. Environment

```bash
cp backend/.env.example backend/.env
# Fill in: MONGO_URI, JWT_SECRET, RPC_URL, RELAYER_PRIVATE_KEY, CHAIN_ID=11155111
# CONTRACT_ADDRESS is filled in after deploy (step 4)
```

### 3. Install & compile

```bash
npm install                   # root: Hardhat + toolbox
npx hardhat compile           # generates ABI for backend
npx hardhat test              # verify all contract tests pass
```

### 4. Deploy contract

```bash
npm run deploy:sepolia        # prints CONTRACT_ADDRESS — copy it into backend/.env
```

### 5. Start backend

```bash
cd backend
npm install
npm start                     # runs on port 4000
```

### 6. Seed demo data

```bash
node scripts/seed.js          # creates admin, 2 institutions, 5 certificates
                              # prints login credentials and certificate IDs
```

### 7. Start frontend

```bash
cd frontend
npm install
npm run dev                   # Vite dev server at http://localhost:5173
```

## Demo flow

1. Log in as **admin** → add an institution (authorized on-chain)
2. Log in as the **institution** → issue a certificate → copy the Certificate ID
3. Open `/verify` (no login) → paste the ID → see **Valid** result with ledger hash comparison
4. Tamper the stored data in MongoDB → verify again → see **Invalid / Tampered** with mismatched hashes
5. Revoke the certificate → verify again → see **Revoked**
6. Enter a made-up ID → see **Not Found**

## API endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login (admin or institution) |
| POST | `/api/institutions` | admin | Register + authorize institution on-chain |
| GET | `/api/institutions` | admin | List all institutions |
| POST | `/api/certificates` | institution | Issue certificate (chain-first) |
| GET | `/api/certificates` | institution/admin | List certificates |
| GET | `/api/certificates/verify/:certId` | public | Verify certificate authenticity |
| POST | `/api/certificates/:certId/revoke` | institution/admin | Revoke certificate |

## Limitations (MVP scope)

- Relayer model: a single backend wallet signs all transactions (institutions do not sign with their own wallets)
- Relayer private key stored in `.env` — not production-grade key management (HSM/KMS deferred)
- No institution self-service registration — admin creates institutions manually
- Sepolia testnet only — no mainnet deployment
