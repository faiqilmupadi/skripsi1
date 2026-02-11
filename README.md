# Database setup (TypeScript)

Project ini sudah disiapkan untuk konek ke MySQL pakai TypeScript.

## Environment

Copy isi `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Contoh isi env:

```env
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=warehouse_db
JWT_SECRET=super-secret-key
```

`DB_HOST` optional, default: `localhost`.

## Menjalankan

```bash
npm install
npm run build
npm run dev
```
