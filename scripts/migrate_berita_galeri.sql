-- Tambahkan field gambar ke tabel berita_desa
ALTER TABLE public.berita_desa
ADD COLUMN url_gambar_cdn character varying(255),
ADD COLUMN gambar_public_id character varying(255),
ADD COLUMN gambar_metadata jsonb DEFAULT '{}'::jsonb;

-- Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_berita_desa_url_gambar_cdn ON public.berita_desa(url_gambar_cdn);

-- Tambahkan field gambar ke tabel galeri_foto
ALTER TABLE public.galeri_foto
ADD COLUMN url_foto_cdn character varying(255),
ADD COLUMN url_thumbnail_cdn character varying(255),
ADD COLUMN foto_public_id character varying(255),
ADD COLUMN foto_metadata jsonb DEFAULT '{}'::jsonb;

-- Buat index untuk galeri_foto
CREATE INDEX IF NOT EXISTS idx_galeri_foto_url_foto_cdn ON public.galeri_foto(url_foto_cdn);
CREATE INDEX IF NOT EXISTS idx_galeri_foto_url_thumbnail_cdn ON public.galeri_foto(url_thumbnail_cdn);
