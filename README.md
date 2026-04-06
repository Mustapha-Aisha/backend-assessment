# Backend Assessment: Microservice Wallet System

A production-grade microservice wallet system built with **NestJS**, **gRPC**, **Prisma ORM**, and **PostgreSQL**, designed with scalability, separation of concerns, and fault tolerance in mind.

---

## 🚀 Overview

This project implements a **distributed backend architecture** with two independent services communicating via **gRPC**:

* **User Service** → Owns user lifecycle (creation & retrieval)
* **Wallet Service** → Owns wallet state (balance, credit, debit)

The system enforces **strict service boundaries**:

> The Wallet Service never assumes user existence — it verifies via User Service using gRPC.

---

## 🧠 Key Engineering Decisions

* **gRPC over REST** → Efficient, strongly-typed inter-service communication
* **Prisma ORM** → Type-safe database access with migrations
* **Monorepo Architecture** → Shared contracts (proto) + shared DB schema
* **Transactions** → Ensures atomicity for wallet debit operations
* **Validation Layer** → Prevents invalid data at service boundaries
* **Explicit Error Handling** → Predictable system behavior under failure

---

## 🏗️ Architecture

```
backend-assessment/
├── apps/
│   ├── user-service/
│   └── wallet-service/
│
├── packages/
│   ├── proto/     # gRPC contracts (single source of truth)
│   └── prisma/    # Database schema & migrations
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/Mustapha-Aisha/backend-assessment.git
cd backend-assessment
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment

```bash
cp .env.example .env
```

Update:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/backend_assessment"
```

---

### 4. Setup Database

```bash
npx prisma migrate dev --schema=packages/prisma/schema.prisma
npx prisma generate
```

👉 This step is **required** — it creates the User and Wallet tables.

---

### 5. Run Services

#### Terminal 1 — User Service

```bash
npm run start user-service
```

Runs on:

```
localhost:50051
```

---

#### Terminal 2 — Wallet Service

```bash
npm run start wallet-service
```

Runs on:

```
localhost:50052
```

---

## 🔗 Service Interaction Flow

### Create Wallet Flow

1. Wallet Service receives request
2. Calls:

   ```
   UserService.GetUserById
   ```
3. If user exists → wallet is created
4. If not → request fails

👉 This ensures **data integrity across services**

---

## 📡 gRPC Endpoints

### User Service

* `CreateUser`
* `GetUserById`

---

### Wallet Service

* `CreateWallet`
* `GetWallet`
* `CreditWallet`
* `DebitWallet`

---

## 🧪 Testing the System

### Recommended Tool: `grpcurl`

---

### 1. Create User

```bash
grpcurl -plaintext \
  -d '{"email":"user@example.com","name":"Aisha"}' \
  localhost:50051 user.UserService/CreateUser
```

---

### 2. Get User

```bash
grpcurl -plaintext \
  -d '{"id":"USER_ID"}' \
  localhost:50051 user.UserService/GetUserById
```

---

### 3. Create Wallet

```bash
grpcurl -plaintext \
  -d '{"userId":"USER_ID"}' \
  localhost:50052 wallet.WalletService/CreateWallet
```

---

### 4. Credit Wallet

```bash
grpcurl -plaintext \
  -d '{"userId":"USER_ID","amount":100}' \
  localhost:50052 wallet.WalletService/CreditWallet
```

---

### 5. Debit Wallet

```bash
grpcurl -plaintext \
  -d '{"userId":"USER_ID","amount":50}' \
  localhost:50052 wallet.WalletService/DebitWallet
```

---

## ⚠️ Edge Cases Handled

* User does not exist → request rejected
* Wallet already exists → prevented
* Wallet not found → handled
* Insufficient balance → transaction fails safely
* Invalid input → validation errors returned

---

## 🗄️ Database Design

### User

* id (UUID)
* email (unique)
* name
* createdAt

### Wallet

* id (UUID)
* userId (unique)
* balance (default: 0)
* createdAt

---

## 🔒 Data Consistency Strategy

* Wallet operations are isolated within Wallet Service
* Cross-service validation done via gRPC
* Debit operations wrapped in **Prisma transactions**

---

## 📦 Scripts

```bash
npm run build
npm run start
npm run start:dev
npm run test
npm run lint
```

---

## 🏆 Bonus Features Implemented

* ✅ Prisma transactions for safe debit operations
* ✅ Input validation using class-validator
* ✅ Structured error handling
* ✅ gRPC-based service-to-service verification
* ✅ Clean monorepo architecture

---

## 🧠 What This Project Demonstrates

* Service boundary design
* Distributed system communication
* Data integrity across services
* Production-style backend structuring

---

## 📄 License

UNLICENSED
