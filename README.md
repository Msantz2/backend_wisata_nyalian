# Village Tourism Reservation System - REST API

A comprehensive REST API for managing village tourism reservations, built with Express.js, PostgreSQL, and Sequelize.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Token)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Logging**: Morgan
- **Environment Variables**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and fill in your configuration:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=wisata_desa
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=1d
   ```

4. **Create the database**
   
   Using PostgreSQL CLI or GUI tool (pgAdmin, DBeaver, etc.):
   ```sql
   CREATE DATABASE wisata_desa;
   ```

5. **Sync database tables**
   
   Run the database sync script to create all tables:
   ```bash
   npm run db:sync
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with auto-reload on file changes.

### Production Mode
```bash
npm start
```

## API Documentation

The API is versioned and accessible at: `http://localhost:3000/api/v1`

For complete API documentation including:
- All available endpoints
- Request/response formats
- Authentication requirements
- Business rules
- Pagination support

Please refer to **[API_REFERENCE.md](./API_REFERENCE.md)**

## Project Structure

```
backend_web/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── models/                  # Sequelize models & associations
│   │   ├── index.js
│   │   ├── admin.model.js
│   │   ├── kategoriDestinasi.model.js
│   │   ├── destinasi.model.js
│   │   ├── paketWisata.model.js
│   │   ├── wisatawan.model.js
│   │   ├── beritaDesa.model.js
│   │   ├── galeriFoto.model.js
│   │   ├── ketersediaanKuota.model.js
│   │   ├── reservasi.model.js
│   │   ├── pembayaran.model.js
│   │   ├── tiket.model.js
│   │   └── ulasanWisatawan.model.js
│   ├── services/                # Business logic
│   ├── controllers/             # Request handlers
│   ├── routes/                  # Route definitions
│   │   └── index.js             # Route aggregator
│   ├── middlewares/             # Custom middlewares
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   └── errorHandler.middleware.js
│   └── utils/                   # Utility functions
│       ├── response.js
│       ├── generateBookingCode.js
│       └── generateQrToken.js
├── scripts/
│   └── syncDatabase.js          # Database sync script
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── .env.example                 # Environment variables template
├── package.json
└── README.md

```

## API Modules

The API is organized into the following modules:

1. **Authentication** (`/api/v1/auth`) - Admin login, logout, profile management
2. **Kategori Destinasi** (`/api/v1/kategori-destinasi`) - Destination categories
3. **Destinasi** (`/api/v1/destinasi`) - Tourist destinations
4. **Admin** (`/api/v1/admin`) - Admin management (Superadmin only)
5. **Paket Wisata** (`/api/v1/paket-wisata`) - Tourism packages
6. **Wisatawan** (`/api/v1/wisatawan`) - Tourist/visitor management
7. **Berita Desa** (`/api/v1/berita`) - Village news
8. **Galeri Foto** (`/api/v1/galeri`) - Photo gallery
9. **Ketersediaan Kuota** (`/api/v1/kuota`) - Quota availability
10. **Reservasi** (`/api/v1/reservasi`) - Reservation management
11. **Pembayaran** (`/api/v1/pembayaran`) - Payment records
12. **Tiket** (`/api/v1/tiket`) - Ticket generation & scanning
13. **Ulasan** (`/api/v1/ulasan`) - Tourist reviews

## API Endpoints Reference

This section provides a detailed list of all available API endpoints per module. The base URL for all endpoints is `/api/v1`.

### 5.1 Auth (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/login` | Login admin (username + password) → JWT | Publik |
| POST | `/auth/logout` | Logout / invalidate token | Admin |
| GET | `/auth/me` | Ambil profil admin yang sedang login | Admin |
| POST | `/auth/change-password` | Ganti password admin | Admin |

**Request Body Examples:**

**POST `/auth/login`**
```json
{
  "username": "admin_username",
  "password": "admin_password"
}
```

**POST `/auth/change-password`**
```json
{
  "old_password": "current_admin_password",
  "new_password": "new_admin_password"
}
```

### 5.2 Kategori Destinasi (`/api/v1/kategori-destinasi`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/kategori-destinasi` | List semua kategori | Publik |
| GET | `/kategori-destinasi/:id` | Detail kategori | Publik |
| POST | `/kategori-destinasi` | Tambah kategori baru | Admin |
| PUT | `/kategori-destinasi/:id` | Update kategori | Admin |
| DELETE | `/kategori-destinasi/:id` | Hapus kategori | Admin |

**Request Body Examples:**

**POST `/kategori-destinasi`**
```json
{
  "nama_kategori": "Pegunungan",
  "deskripsi_kategori": "Destinasi yang berfokus pada wisata alam pegunungan."
}
```

**PUT `/kategori-destinasi/:id`**
```json
{
  "nama_kategori": "Pegunungan & Hutan",
  "deskripsi_kategori": "Destinasi wisata pegunungan dan eksplorasi hutan."
}
```

### 5.3 Destinasi (`/api/v1/destinasi`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/destinasi` | List destinasi (filter `id_kategori`, `search`) | Publik |
| GET | `/destinasi/:id` | Detail destinasi + kategori | Publik |
| GET | `/destinasi/:id/galeri` | List foto galeri milik destinasi | Publik |
| POST | `/destinasi` | Tambah destinasi | Admin |
| PUT | `/destinasi/:id` | Update destinasi | Admin |
| DELETE | `/destinasi/:id` | Hapus destinasi | Admin |

**Request Body Examples:**

**POST `/destinasi`**
```json
{
  "id_kategori": 1,
  "nama_destinasi": "Air Terjun Tegal Sari",
  "deskripsi": "Air terjun alami dengan pemandangan indah.",
  "lokasi_maps": "https://maps.google.com/?q=air-terjun-tegal-sari",
  "jam_operasional": "08:00 - 17:00",
  "fasilitas": "Toilet, Mushola, Area Parkir"
}
```

**PUT `/destinasi/:id`**
```json
{
  "nama_destinasi": "Air Terjun Tegal Sari Baru",
  "jam_operasional": "07:00 - 18:00"
}
```

### 5.4 Admin (`/api/v1/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/admin` | List semua admin | Superadmin |
| GET | `/admin/:id` | Detail admin | Superadmin |
| POST | `/admin` | Tambah admin baru | Superadmin |
| PUT | `/admin/:id` | Update data admin | Superadmin |
| DELETE | `/admin/:id` | Hapus admin | Superadmin |

**Request Body Examples:**

**POST `/admin`**
```json
{
  "username": "new_admin",
  "password": "strong_password",
  "nama_lengkap": "Admin Baru",
  "role": "admin"
}
```

**PUT `/admin/:id`**
```json
{
  "nama_lengkap": "Admin Diperbarui",
  "role": "superadmin"
}
```

### 5.5 Paket Wisata (`/api/v1/paket-wisata`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/paket-wisata` | List paket wisata (filter `search`, `harga_min`, `harga_max`) | Publik |
| GET | `/paket-wisata/:id` | Detail paket wisata | Publik |
| GET | `/paket-wisata/:id/galeri` | Foto galeri milik paket | Publik |
| GET | `/paket-wisata/:id/kuota` | Ketersediaan kuota per tanggal | Publik |
| POST | `/paket-wisata` | Tambah paket wisata | Admin |
| PUT | `/paket-wisata/:id` | Update paket wisata | Admin |
| DELETE | `/paket-wisata/:id` | Hapus paket wisata | Admin |

**Request Body Examples:**

**POST `/paket-wisata`**
```json
{
  "nama_paket": "Paket Petualangan Air Terjun",
  "deskripsi_paket": "Nikmati petualangan seru ke beberapa air terjun tersembunyi.",
  "harga_per_pax": 250000,
  "itinerary": "Hari 1: Penjemputan, Air Terjun A, Makan Siang; Hari 2: Air Terjun B, Pulang.",
  "kuota_default": 20
}
```

**PUT `/paket-wisata/:id`**
```json
{
  "harga_per_pax": 275000,
  "kuota_default": 25
}
```

### 5.6 Wisatawan (`/api/v1/wisatawan`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/wisatawan` | List wisatawan (filter `search` nama/email) | Admin |
| GET | `/wisatawan/:id` | Detail wisatawan | Admin |
| GET | `/wisatawan/:id/reservasi` | Riwayat reservasi wisatawan | Admin |
| POST | `/wisatawan` | Registrasi wisatawan baru | Publik |
| PUT | `/wisatawan/:id` | Update data wisatawan | Publik/Admin |
| DELETE | `/wisatawan/:id` | Hapus wisatawan | Admin |

**Request Body Examples:**

**POST `/wisatawan`**
```json
{
  "nama_lengkap": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "no_whatsapp": "6281234567890"
}
```

**PUT `/wisatawan/:id`**
```json
{
  "email": "budi.s@newmail.com",
  "no_whatsapp": "6287654321098"
}
```

### 5.7 Berita Desa (`/api/v1/berita`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/berita` | List berita (filter `search`, sort by tanggal) | Publik |
| GET | `/berita/:id` | Detail berita | Publik |
| POST | `/berita` | Tambah berita (otomatis set `id_admin` dari token) | Admin |
| PUT | `/berita/:id` | Update berita | Admin |
| DELETE | `/berita/:id` | Hapus berita | Admin |

**Request Body Examples:**

**POST `/berita`**
```json
{
  "judul_berita": "Gotong Royong Bersih Desa",
  "isi_konten": "Warga desa mengadakan kegiatan gotong royong membersihkan lingkungan desa.",
  "url_thumbnail_cdn": "https://cdn.example.com/gotong-royong.jpg"
}
```

**PUT `/berita/:id`**
```json
{
  "judul_berita": "Gotong Royong Bersih Desa Tahap 2",
  "isi_konten": "Kegiatan gotong royong dilanjutkan ke area persawahan."
}
```

### 5.8 Galeri Foto (`/api/v1/galeri`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/galeri` | List semua foto (filter `id_destinasi`, `id_paket`) | Publik |
| GET | `/galeri/:id` | Detail foto | Publik |
| POST | `/galeri` | Upload/tambah foto (bisa pakai multer) | Admin |
| PUT | `/galeri/:id` | Update caption/foto | Admin |
| DELETE | `/galeri/:id` | Hapus foto | Admin |

**Request Body Examples:**

**POST `/galeri`**
```json
{
  "id_destinasi": 1,
  "id_paket": null,
  "url_foto_cdn": "https://cdn.example.com/destinasi-1-foto-1.jpg",
  "caption": "Pemandangan indah destinasi pertama."
}
```

**PUT `/galeri/:id`**
```json
{
  "caption": "Pemandangan matahari terbit di destinasi pertama."
}
```

### 5.9 Ketersediaan Kuota (`/api/v1/kuota`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/kuota` | List semua data kuota (filter `id_paket`, `tanggal`) | Publik |
| GET | `/kuota/:id` | Detail kuota | Publik |
| POST | `/kuota` | Tambah slot kuota tanggal tertentu | Admin |
| PUT | `/kuota/:id` | Update sisa kuota | Admin |
| DELETE | `/kuota/:id` | Hapus slot kuota | Admin |

**Request Body Examples:**

**POST `/kuota`**
```json
{
  "id_paket": 1,
  "tanggal": "2024-12-25",
  "sisa_kuota": 30
}
```

**PUT `/kuota/:id`**
```json
{
  "sisa_kuota": 25
}
```

### 5.10 Reservasi (`/api/v1/reservasi`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/reservasi` | List reservasi (filter `status_reservasi`, `tipe_reservasi`, `tanggal_kunjungan`, `id_paket`) | Admin |
| GET | `/reservasi/:id` | Detail reservasi lengkap (wisatawan, paket, pembayaran, tiket) | Admin |
| GET | `/reservasi/kode/:kode_booking` | Cari reservasi berdasarkan kode booking | Publik (untuk cek status booking) |
| POST | `/reservasi` | Buat reservasi baru (generate `kode_booking`, kurangi `sisa_kuota`, hitung `total_harga`) | Publik |
| PUT | `/reservasi/:id` | Update detail reservasi | Admin |
| PATCH | `/reservasi/:id/status` | Update `status_reservasi` (confirm/cancel/complete) | Admin |
| DELETE | `/reservasi/:id` | Hapus reservasi | Admin |

**Request Body Examples:**

**POST `/reservasi`**
```json
{
  "id_wisatawan": 1,
  "id_paket": 1,
  "tanggal_kunjungan": "2024-12-25",
  "jumlah_pax": 2,
  "tipe_reservasi": "online"
}
```

**PUT `/reservasi/:id`**
```json
{
  "jumlah_pax": 3,
  "tipe_reservasi": "walk-in"
}
```

**PATCH `/reservasi/:id/status`**
```json
{
  "status_reservasi": "confirmed"
}
```

### 5.11 Pembayaran (`/api/v1/pembayaran`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/pembayaran` | List pembayaran (filter `metode_bayar`) | Admin |
| GET | `/pembayaran/:id` | Detail pembayaran | Admin |
| GET | `/pembayaran/reservasi/:id_reservasi` | List pembayaran milik satu reservasi | Admin |
| POST | `/pembayaran` | Catat pembayaran baru (upload bukti transfer) | Publik/Admin |
| PUT | `/pembayaran/:id` | Update data pembayaran | Admin |
| DELETE | `/pembayaran/:id` | Hapus data pembayaran | Admin |

**Request Body Examples:**

**POST `/pembayaran`**
```json
{
  "id_reservasi": 1,
  "metode_bayar": "Transfer Bank",
  "bukti_transfer": "https://cdn.example.com/bukti_transfer_1.jpg"
}
```

**PUT `/pembayaran/:id`**
```json
{
  "metode_bayar": "QRIS",
  "bukti_transfer": "https://cdn.example.com/bukti_qris_1.jpg"
}
```

### 5.12 Tiket (`/api/v1/tiket`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/tiket` | List tiket (filter `status_tiket`) | Admin |
| GET | `/tiket/:id` | Detail tiket | Admin |
| GET | `/tiket/reservasi/:id_reservasi` | Tiket milik satu reservasi | Publik/Admin |
| POST | `/tiket` | Generate tiket baru (buat `kode_qr_token` unik, status default `unused`) | Admin |
| PATCH | `/tiket/:id/scan` | Validasi/scan QR di lokasi, set `status_tiket = used` dan `waktu_scan = now()` | Admin |
| DELETE | `/tiket/:id` | Hapus tiket | Admin |

**Request Body Examples:**

**POST `/tiket`**
```json
{
  "id_reservasi": 1
}
```

### 5.13 Ulasan Wisatawan (`/api/v1/ulasan`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/ulasan` | List semua ulasan (filter `rating_bintang`, `id_paket` via join reservasi) | Publik |
| GET | `/ulasan/:id` | Detail ulasan | Publik |
| GET | `/ulasan/reservasi/:id_reservasi` | Ulasan untuk satu reservasi | Publik |
| POST | `/ulasan` | Tambah ulasan (hanya untuk reservasi berstatus `completed`) | Publik |
| PUT | `/ulasan/:id` | Update ulasan | Publik/Admin |
| DELETE | `/ulasan/:id` | Hapus ulasan | Admin |

**Request Body Examples:**

**POST `/ulasan`**
```json
{
  "id_reservasi": 1,
  "rating_bintang": 5,
  "komentar": "Pengalaman wisata yang luar biasa, sangat direkomendasikan!"
}
```

**PUT `/ulasan/:id`**
```json
{
  "rating_bintang": 4,
  "komentar": "Pengalaman yang baik, namun ada sedikit peningkatan yang bisa dilakukan."
}
```


## Key Features

- ✅ JWT-based authentication with role-based access control (Admin/Superadmin)
- ✅ Complete CRUD operations for all modules
- ✅ Automated booking code generation
- ✅ Quota management with automatic decrement/restore
- ✅ QR code token generation for tickets
- ✅ Ticket scanning validation
- ✅ Review system with business rules
- ✅ Pagination support on all list endpoints
- ✅ Request validation using Joi
- ✅ Centralized error handling
- ✅ Database transactions for critical operations

## License

ISC
