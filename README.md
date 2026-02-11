# Warehouse Fullstack (Next.js + Drizzle + MySQL)

## Stack
- Next.js App Router + TypeScript
- TailwindCSS + shadcn/ui style + lucide-react + recharts
- Drizzle ORM + drizzle-kit + mysql2
- Auth bcrypt + JWT (jose) via httpOnly cookie

## Setup (Tanpa Docker)
1. Install MySQL lokal
2. Create database `warehouse`
3. Copy `.env.example` ke `.env` lalu isi `DATABASE_URL` dan `AUTH_SECRET`
4. Install dependencies
   ```bash
   pnpm i
   ```
5. Migrate schema
   ```bash
   pnpm db:migrate
   ```
6. Seed dari excel `data/datasetreal.xlsx`
   ```bash
   pnpm db:seed
   ```
7. Jalankan development server
   ```bash
   pnpm dev
   ```

## Catatan
- Hanya menggunakan 5 tabel utama: `users`, `material_master`, `material_stock`, `material_plant_data`, `material_movement`.
- Restock workflow memakai movement: `RESTOCK_REQ` -> `RESTOCK_PROC` -> `101`.
