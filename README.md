# ifs24046-pabwe2026-nextjs — Delcom Lost & Found

Studi kasus Lost & Found menggunakan Delcom Open API.

## Setup

```bash
bun install
bun run dev
```

Buka http://localhost:3000

## Fitur

- Login / Register
- Lihat **semua** laporan lost & found dari seluruh pengguna, atau hanya **Laporan Saya** (`is_me=1`)
- Dashboard metrik: Total, Barang Hilang, Barang Ditemukan, Selesai, Proses
- Tambah laporan (status: lost / found)
- Ubah, hapus, ganti cover
- Users & Profile
- Statistik harian dan bulanan (`/stats`)

API: `https://open-api.delcom.org/api/v1/lost-founds`
