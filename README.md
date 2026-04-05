# Backend Assessment: Microservice Wallet System

A scalable microservice-based wallet system built with **NestJS**, **gRPC**, **Prisma ORM**, and **PostgreSQL**.

## 📋 Project Overview

This project demonstrates a production-grade microservice architecture with two independent services communicating via gRPC:

- **User Service**: Manages user creation and retrieval
- **Wallet Service**: Manages wallet balances with credit/debit operations

### Key Features

✅ **gRPC Communication**: Inter-service communication using Protocol Buffers  
✅ **Prisma ORM**: Type-safe database access with migrations  
✅ **Validation**: Input validation using `class-validator`  
✅ **Error Handling**: Comprehensive error handling with meaningful messages  
✅ **Transactions**: Prisma transactions for atomic wallet operations  
✅ **Structured Logging**: (Optional) PinoJS for structured logs  
✅ **Monorepo Architecture**: Organized project structure with shared packages  

---

## 🏗️ Architecture

```
backend-assessment/
├── apps/
│   ├── user-service/          # User management service
│   │   ├── src/
│   │   │   ├── main.ts        # gRPC server entry point
│   │   │   ├── user-service.module.ts
│   │   │   ├── user-service.service.ts
│   │   │   ├── user-service.controller.ts
│   │   │   └── user.dto.ts
│   │   └── test/
│   │
│   └── wallet-service/        # Wallet management service
│       ├── src/
│       │   ├── main.ts        # gRPC server entry point
│       │   ├── wallet-service.module.ts
│       │   ├── wallet-service.service.ts
│       │   ├── wallet-service.controller.ts
│       │   └── wallet.dto.ts
│       └── test/
│
├── packages/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration files
│   ├── proto/
│   │   ├── user-service.proto     # User service gRPC definitions
│   │   └── wallet-service.proto   # Wallet service gRPC definitions
│   └── prisma.config.ts       # Prisma configuration
│
├── .env                       # Environment variables
├── .env.example              # Example environment variables
├── nest-cli.json             # Nest CLI configuration
├── package.json              # Dependencies
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **PostgreSQL** 12+ running locally or remotely

### 1. Setup Environment

```bash
# Copy environment file
cp .env.example .env

# Update .env with your PostgreSQL credentials
# Example:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/backend_assessment?schema=public"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
cd packages

# Generate Prisma client
npx prisma generate

# Run migrations (creates User and Wallet tables)
npx prisma migrate dev --name init

# (Optional) View database with Prisma Studio
npx prisma studio
```

### 4. Build Services

```bash
npm run build
```

### 5. Run Services

**Terminal 1 - User Service:**
```bash
npm start user-service
# Output: User Service is running on port 50051
```

**Terminal 2 - Wallet Service:**
```bash
npm start wallet-service
# Output: Wallet Service is running on port 50052
```

---

## 📡 gRPC Endpoints

### User Service (Port 50051)

#### `CreateUser`
Creates a new user.

**Request:**
```protobuf
message CreateUserRequest {
  string email = 1;
  string name = 2;
}
```

**Response:**
```protobuf
message CreateUserResponse {
  string id = 1;
  string email = 2;
  string name = 3;
  string createdAt = 4;
}
```

#### `GetUserById`
Retrieves user by ID.

**Request:**
```protobuf
message GetUserByIdRequest {
  string id = 1;
}
```

---

### Wallet Service (Port 50052)

#### `CreateWallet`
Creates a wallet for a user (requires user to exist).

#### `GetWallet`
Retrieves wallet balance for a user.

#### `CreditWallet`
Adds funds to a wallet.

#### `DebitWallet`
Deducts funds from a wallet (with balance validation).

---

## 🧪 Testing with gRPC Clients

### Using grpcurl

Install grpcurl:
```bash
# On Windows with Chocolatey
choco install grpcurl

# Or download from https://github.com/fullstorydev/grpcurl
```

#### Create User
```bash
grpcurl -plaintext \
  -d '{"email": "user@example.com", "name": "John Doe"}' \
  localhost:50051 user.UserService/CreateUser
```

**Example Response:**
```json
{
  "id": "clx123abc456",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-04-05T10:30:00Z"
}
```

#### Get User by ID
```bash
grpcurl -plaintext \
  -d '{"id": "clx123abc456"}' \
  localhost:50051 user.UserService/GetUserById
```

#### Create Wallet
```bash
grpcurl -plaintext \
  -d '{"userId": "clx123abc456"}' \
  localhost:50052 wallet.WalletService/CreateWallet
```

**Example Response:**
```json
{
  "id": "cwl456def789",
  "userId": "clx123abc456",
  "balance": 0,
  "createdAt": "2024-04-05T10:32:00Z"
}
```

#### Credit Wallet
```bash
grpcurl -plaintext \
  -d '{"userId": "clx123abc456", "amount": 100.50}' \
  localhost:50052 wallet.WalletService/CreditWallet
```

**Example Response:**
```json
{
  "id": "cwl456def789",
  "userId": "clx123abc456",
  "balance": 100.5
}
```

#### Debit Wallet
```bash
grpcurl -plaintext \
  -d '{"userId": "clx123abc456", "amount": 25.00}' \
  localhost:50052 wallet.WalletService/DebitWallet
```

**Example Response:**
```json
{
  "id": "cwl456def789",
  "userId": "clx123abc456",
  "balance": 75.5
}
```

---

### Using Postman

Import the included `postman-collection.json` (if available) or manually create requests with gRPC type set to "gRPC Request".

---

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE "users" (
  id        VARCHAR(255) PRIMARY KEY,
  email     VARCHAR(255) UNIQUE NOT NULL,
  name      VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wallet Table
```sql
CREATE TABLE "wallets" (
  id        VARCHAR(255) PRIMARY KEY,
  userId    VARCHAR(255) UNIQUE NOT NULL,
  balance   FLOAT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES "users"(id) ON DELETE CASCADE
);
```

---

## 📝 Scripts

```bash
# Development
npm run start:dev          # Run with watch mode

# Building
npm run build              # Build all services

# Testing
npm test                   # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run E2E tests

# Formatting
npm run format             # Format code with Prettier
npm run lint               # Lint code with ESLint
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/backend_assessment` |
| `USER_SERVICE_GRPC_PORT` | User service gRPC port | `50051` |
| `WALLET_SERVICE_GRPC_PORT` | Wallet service gRPC port | `50052` |

---

## 🔐 Error Handling

The system handles the following error scenarios:

| Error | Scenario | Message |
|-------|----------|---------|
| `NOT_FOUND` | User not found | "User with ID {id} not found" |
| `NOT_FOUND` | Wallet not found | "Wallet not found for this user" |
| `INVALID_ARGUMENT` | Wallet already exists | "Wallet already exists for this user" |
| `INVALID_ARGUMENT` | Insufficient balance | "Insufficient balance" |
| `INVALID_ARGUMENT` | Invalid input | Validation error details |

---

## 📦 Technologies Used

- **NestJS 11** - Progressive Node.js framework
- **gRPC & Protocol Buffers** - High-performance IPC
- **Prisma 7** - Next-generation ORM
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe JavaScript
- **class-validator** - Input validation
- **class-transformer** - Data transformation
- **Pino** - Structured logging (optional)

---

## 🙋 Development Notes

### Adding New Services

1. Generate new service: `nest g app service-name`
2. Create proto files in `packages/proto/`
3. Implement service following the same pattern
4. Register in `nest-cli.json`

### Prisma Migrations

After schema changes:
```bash
cd packages
npx prisma migrate dev --name migration_name
```

### Database Queries

Use Prisma Studio to explore data:
```bash
cd packages
npx prisma studio
```

---

## 💡 Bonus Features Implemented

✅ **Transactions**: Wallet debit operations use Prisma transactions  
✅ **Validation**: All inputs validated with `class-validator`  
✅ **Error Handling**: Comprehensive error responses  
✅ **gRPC Communication**: Wallet Service calls User Service to verify users  
✅ **Type Safety**: Full TypeScript support  

---

## 📄 License

UNLICENSED

---

## 📧 Support

For issues or questions about the implementation, refer to:
- [NestJS Documentation](https://docs.nestjs.com/)
- [gRPC Documentation](https://grpc.io/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
