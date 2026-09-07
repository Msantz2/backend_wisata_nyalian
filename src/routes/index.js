/**
 * Routes Index
 * Aggregator untuk semua route modules
 * Base path: /api/v1
 */

const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const kategoriDestinationRoutes = require('./kategoriDestinasi.routes');
const kategoriPaketRoutes = require('./kategoriPaket.routes');
const destinasiRoutes = require('./destinasi.routes');
const paketWisataRoutes = require('./paketWisata.routes');
const paketDestinationRoutes = require('./paketDestinasi.routes');
const wisatawanRoutes = require('./wisatawan.routes');
const beritaDesaRoutes = require('./beritaDesa.routes');
const galeriFotoRoutes = require('./galeriFoto.routes');
const ketersediaanKuotaRoutes = require('./ketersediaanKuota.routes');
const reservasiRoutes = require('./reservasi.routes');
const pembayaranRoutes = require('./pembayaran.routes');
const tiketRoutes = require('./tiket.routes');
const ulasanWisatawanRoutes = require('./ulasanWisatawan.routes');
const faqRoutes = require('./faq.routes');

/**
 * Auth Routes
 * POST /api/v1/auth/login
 * POST /api/v1/auth/logout
 * GET  /api/v1/auth/me
 * POST /api/v1/auth/change-password
 */
router.use('/auth', authRoutes);

/**
 * Admin Routes
 * GET  /api/v1/admin
 * GET  /api/v1/admin/:id
 * POST /api/v1/admin
 * PUT  /api/v1/admin/:id
 * DELETE /api/v1/admin/:id
 */
router.use('/admin', adminRoutes);

/**
 * Kategori Destinasi Routes
 * GET    /api/v1/kategori-destinasi
 * GET    /api/v1/kategori-destinasi/:id
 * POST   /api/v1/kategori-destinasi
 * PUT    /api/v1/kategori-destinasi/:id
 * DELETE /api/v1/kategori-destinasi/:id
 */
router.use('/kategori-destinasi', kategoriDestinationRoutes);

/**
 * Kategori Paket Routes [NEW]
 * GET    /api/v1/kategori-paket
 * GET    /api/v1/kategori-paket/:id
 * POST   /api/v1/kategori-paket
 * PUT    /api/v1/kategori-paket/:id
 * DELETE /api/v1/kategori-paket/:id
 */
router.use('/kategori-paket', kategoriPaketRoutes);

/**
 * Destinasi Routes
 * GET    /api/v1/destinasi
 * GET    /api/v1/destinasi/:id
 * GET    /api/v1/destinasi/:id/galeri
 * GET    /api/v1/destinasi/:id/paket
 * POST   /api/v1/destinasi
 * PUT    /api/v1/destinasi/:id
 * DELETE /api/v1/destinasi/:id
 */
router.use('/destinasi', destinasiRoutes);

/**
 * Paket Wisata Routes
 * GET    /api/v1/paket-wisata
 * GET    /api/v1/paket-wisata/:id
 * GET    /api/v1/paket-wisata/:id/destinasi
 * GET    /api/v1/paket-wisata/:id/galeri
 * GET    /api/v1/paket-wisata/:id/kuota
 * GET    /api/v1/paket-wisata/:id/ulasan
 * POST   /api/v1/paket-wisata
 * PUT    /api/v1/paket-wisata/:id
 * DELETE /api/v1/paket-wisata/:id
 */
router.use('/paket-wisata', paketWisataRoutes);

/**
 * Paket Destinasi Routes [NEW - M:M Junction]
 * GET    /api/v1/paket-destinasi
 * GET    /api/v1/paket-destinasi/paket/:idPaket
 * POST   /api/v1/paket-destinasi
 * POST   /api/v1/paket-destinasi/bulk
 * PUT    /api/v1/paket-destinasi/:id
 * DELETE /api/v1/paket-destinasi/:id
 */
router.use('/paket-destinasi', paketDestinationRoutes);

/**
 * Wisatawan Routes
 * GET    /api/v1/wisatawan
 * GET    /api/v1/wisatawan/:id
 * GET    /api/v1/wisatawan/:id/reservasi
 * POST   /api/v1/wisatawan
 * PUT    /api/v1/wisatawan/:id
 * DELETE /api/v1/wisatawan/:id
 */
router.use('/wisatawan', wisatawanRoutes);

/**
 * Berita Desa Routes
 * GET    /api/v1/berita
 * GET    /api/v1/berita/:id
 * POST   /api/v1/berita
 * PUT    /api/v1/berita/:id
 * DELETE /api/v1/berita/:id
 */
router.use('/berita', beritaDesaRoutes);

/**
 * Galeri Foto Routes
 * GET    /api/v1/galeri
 * GET    /api/v1/galeri/:id
 * POST   /api/v1/galeri
 * PUT    /api/v1/galeri/:id
 * DELETE /api/v1/galeri/:id
 */
router.use('/galeri', galeriFotoRoutes);

/**
 * Ketersediaan Kuota Routes
 * GET    /api/v1/kuota
 * GET    /api/v1/kuota/:id
 * POST   /api/v1/kuota
 * PUT    /api/v1/kuota/:id
 * DELETE /api/v1/kuota/:id
 */
router.use('/kuota', ketersediaanKuotaRoutes);

/**
 * Reservasi Routes
 * GET    /api/v1/reservasi
 * GET    /api/v1/reservasi/:id
 * GET    /api/v1/reservasi/kode/:kode_booking
 * POST   /api/v1/reservasi
 * PUT    /api/v1/reservasi/:id
 * PATCH  /api/v1/reservasi/:id/status
 * DELETE /api/v1/reservasi/:id
 */
router.use('/reservasi', reservasiRoutes);

/**
 * Pembayaran Routes
 * GET    /api/v1/pembayaran
 * GET    /api/v1/pembayaran/:id
 * GET    /api/v1/pembayaran/reservasi/:id_reservasi
 * POST   /api/v1/pembayaran
 * PUT    /api/v1/pembayaran/:id
 * DELETE /api/v1/pembayaran/:id
 */
router.use('/pembayaran', pembayaranRoutes);

/**
 * Tiket Routes
 * GET    /api/v1/tiket
 * GET    /api/v1/tiket/:id
 * GET    /api/v1/tiket/reservasi/:id_reservasi
 * POST   /api/v1/tiket
 * PATCH  /api/v1/tiket/:id/scan
 * DELETE /api/v1/tiket/:id
 */
router.use('/tiket', tiketRoutes);

/**
 * Ulasan Wisatawan Routes
 * GET    /api/v1/ulasan
 * GET    /api/v1/ulasan/:id
 * GET    /api/v1/ulasan/reservasi/:id_reservasi
 * POST   /api/v1/ulasan
 * PUT    /api/v1/ulasan/:id
 * DELETE /api/v1/ulasan/:id
 */
router.use('/ulasan', ulasanWisatawanRoutes);

/**
 * FAQ Routes [NEW]
 * GET    /api/v1/faq
 * GET    /api/v1/faq/:id
 * POST   /api/v1/faq
 * PUT    /api/v1/faq/:id
 * DELETE /api/v1/faq/:id
 */
router.use('/faq', faqRoutes);

module.exports = router;
