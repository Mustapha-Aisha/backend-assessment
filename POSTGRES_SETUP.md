# PostgreSQL Setup Guide

## Windows Installation

### Option 1: Using PostgreSQL Installer (Recommended)

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow these steps:
   - Accept the default installation path
   - Set a password for the `postgres` user (remember this!)
   - Port: 5432 (default)
   - Locale: [System locale]
3. Note: PostgreSQL will start automatically as a service

### Option 2: Using Chocolatey

```powershell
choco install postgresql
# This will prompt for postgres user password during installation
```

### Option 3: Using Docker (Best for Development)

```bash
docker run --name postgres_db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=backend_assessment \
  -p 5432:5432 \
  -d postgres:16
```

## Verify Installation

```bash
# Test connection with psql (comes with PostgreSQL)
psql -U postgres -h localhost

# Or use a GUI tool:
# - pgAdmin (https://www.pgadmin.org/) - Web interface
# - DBeaver (https://dbeaver.io/) - Desktop client
```

## Configure Your Wallet Application

1. **Update `.env` file** with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/backend_assessment?schema=public"
USER_SERVICE_GRPC_PORT=50051
WALLET_SERVICE_GRPC_PORT=50052
```

2. **Create the database** (optional - Prisma will create it):

```bash
createdb -U postgres backend_assessment
```

3. **Run Prisma migrations**:

```bash
cd packages
npx prisma migrate dev --name init
```

## Troubleshooting

### Connection refused
- Ensure PostgreSQL service is running
- Windows: Check Services (services.msc) for "postgresql-x64-16"

### Wrong password
- Reset postgres password:
  ```bash
  psql -U postgres
  ALTER USER postgres WITH PASSWORD 'new_password';
  ```

### Port already in use
- Change port in `.env`: 
  ```
  DATABASE_URL="postgresql://...@localhost:5433/..."
  ```
- Then update pg_hba.conf or use different port in Docker

## Next Steps

After PostgreSQL is set up and running:

```bash
# Install dependencies
npm install

# Generate Prisma client
cd packages
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio

# Go back to root
cd ..

# Start services in separate terminals
npm start user-service      # Terminal 1
npm start wallet-service    # Terminal 2
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Can't reach database server" | PostgreSQL not running or wrong connection string |
| "Database does not exist" | Run `createdb -U postgres backend_assessment` or update DATABASE_URL |
| "Role postgres does not exist" | Reinstall PostgreSQL |
| "Port 5432 already in use" | Use different port or kill existing process |

## Additional Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Prisma PostgreSQL Guide: https://www.prisma.io/docs/orm/overview/databases/postgresql
