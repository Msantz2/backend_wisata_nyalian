-- Cloudinary CDN Integration - Database Schema Migration
-- Database: desa_wisata_nyalian
-- Purpose: Add image CDN columns to 4 tables
-- Date: 2026-08-25

-- ============================================
-- TABLE 1: DESTINASI
-- ============================================
ALTER TABLE destinasi ADD COLUMN IF NOT EXISTS url_gambar_cdn VARCHAR(255);
ALTER TABLE destinasi ADD COLUMN IF NOT EXISTS url_thumbnail_cdn VARCHAR(255);
ALTER TABLE destinasi ADD COLUMN IF NOT EXISTS gambar_public_id VARCHAR(255);
ALTER TABLE destinasi ADD COLUMN IF NOT EXISTS gambar_metadata JSONB;

-- ============================================
-- TABLE 2: PAKET_WISATA
-- ============================================
ALTER TABLE paket_wisata ADD COLUMN IF NOT EXISTS url_gambar_cdn VARCHAR(255);
ALTER TABLE paket_wisata ADD COLUMN IF NOT EXISTS url_thumbnail_cdn VARCHAR(255);
ALTER TABLE paket_wisata ADD COLUMN IF NOT EXISTS gambar_public_id VARCHAR(255);
ALTER TABLE paket_wisata ADD COLUMN IF NOT EXISTS gambar_metadata JSONB;

-- ============================================
-- TABLE 3: BERITA_DESA
-- ============================================
ALTER TABLE berita_desa ADD COLUMN IF NOT EXISTS url_gambar_cdn VARCHAR(255);
ALTER TABLE berita_desa ADD COLUMN IF NOT EXISTS gambar_public_id VARCHAR(255);
ALTER TABLE berita_desa ADD COLUMN IF NOT EXISTS gambar_metadata JSONB;

-- ============================================
-- TABLE 4: GALERI_FOTO
-- ============================================
ALTER TABLE galeri_foto ADD COLUMN IF NOT EXISTS url_foto_cdn VARCHAR(255);
ALTER TABLE galeri_foto ADD COLUMN IF NOT EXISTS url_thumbnail_cdn VARCHAR(255);
ALTER TABLE galeri_foto ADD COLUMN IF NOT EXISTS foto_public_id VARCHAR(255);
ALTER TABLE galeri_foto ADD COLUMN IF NOT EXISTS foto_metadata JSONB;

-- ============================================
-- Verification Queries
-- ============================================
-- Uncomment to verify columns were added:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'destinasi' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'paket_wisata' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'berita_desa' ORDER BY ordinal_position;
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'galeri_foto' ORDER BY ordinal_position;
