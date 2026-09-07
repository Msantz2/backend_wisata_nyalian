const { PaketWisata, GaleriFoto, KetersediaanKuota, KategoriPaket } = require('../models');
const { Op } = require('sequelize');
const { uploadImage, deleteImage } = require('./cloudinaryService');
const { generateSlug } = require('../utils/generateSlug');
const { v4: uuidv4 } = require('uuid');

const getAllPaket = async (filters) => {
  const { page = 1, limit = 10, search, harga_min, harga_max, id_kategori, featured = false, sort = 'id_paket', order = 'ASC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = { deleted_at: null }; // Exclude soft-deleted records

  if (search) {
    where[Op.or] = [
      { nama_paket: { [Op.iLike]: `%${search}%` } },
      { deskripsi_paket: { [Op.iLike]: `%${search}%` } }
    ];
  }

  if (harga_min) {
    where.harga_per_pax = { ...where.harga_per_pax, [Op.gte]: parseInt(harga_min) };
  }

  if (harga_max) {
    where.harga_per_pax = { ...where.harga_per_pax, [Op.lte]: parseInt(harga_max) };
  }

  if (id_kategori) {
    where.id_kategori = parseInt(id_kategori);
  }

  // Add featured filter if specified
  if (featured === true || featured === 'true') {
    where.featured = true;
  }

  const { count, rows } = await PaketWisata.findAndCountAll({
    where,
    include: [
      {
        model: KategoriPaket,
        as: 'kategori_paket',
        attributes: ['id_kategori', 'nama_kategori'],
        required: false
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [[sort, order.toUpperCase()]],
    subQuery: false
  });

  return {
    data: rows,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count
    }
  };
};

const getPaketById = async (id) => {
  const paket = await PaketWisata.findByPk(id, {
    include: [
      {
        model: KategoriPaket,
        as: 'kategori_paket',
        attributes: ['id_kategori', 'nama_kategori'],
        required: false
      }
    ]
  });
  
  if (!paket) {
    const error = new Error('Paket wisata tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return paket;
};

const getPaketGaleri = async (id_paket) => {
  try {
    const paket = await getPaketById(id_paket);
    
    // Gallery images are stored in the GaleriFoto table linked to destinations
    // Get all destinations for this package, then get their gallery photos
    const { pool } = require('../config/database');
    
    const query = `
      SELECT 
        gf.id_galeri,
        gf.id_destinasi,
        gf.url_foto_cdn,
        gf.caption,
        gf.urutan,
        gf.alt_text,
        gf.tipe_media,
        gf.created_at,
        pd.urutan as paket_urutan
      FROM galeri_foto gf
      INNER JOIN destinasi d ON gf.id_destinasi = d.id_destinasi
      INNER JOIN paket_destinasi pd ON d.id_destinasi = pd.id_destinasi
      WHERE pd.id_paket = $1 AND d.deleted_at IS NULL
      ORDER BY pd.urutan ASC, gf.urutan ASC
    `;
    
    const result = await pool.query(query, [id_paket]);
    console.log(`[getPaketGaleri] Found ${result.rows.length} gallery photos for package ${id_paket}`);
    
    // Remove the paket_urutan helper column from results
    const cleanedResults = result.rows.map(row => {
      const { paket_urutan, ...rest } = row;
      return rest;
    });
    
    return cleanedResults;
  } catch (error) {
    console.error(`Error fetching gallery for package ${id_paket}:`, error);
    throw error;
  }
};

const getPaketKuota = async (id_paket, filters = {}) => {
  const paket = await getPaketById(id_paket);
  
  const where = { id_paket };
  
  if (filters.tanggal) {
    where.tanggal = filters.tanggal;
  }

  const kuota = await KetersediaanKuota.findAll({
    where,
    order: [['tanggal', 'ASC']]
  });

  return kuota;
};

const createPaket = async (data, userId, fileBuffer = null) => {
  const paketData = {
    ...data,
    created_by: userId
  };

  // Auto-generate slug if not provided
  if (!paketData.slug && paketData.nama_paket) {
    let baseSlug = generateSlug(paketData.nama_paket);
    let slug = baseSlug;
    let counter = 1;
    
    // Check for uniqueness
    while (await PaketWisata.findOne({ where: { slug, deleted_at: null } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    paketData.slug = slug;
  }

  // Upload image to Cloudinary (single image, no thumbnail)
  if (fileBuffer) {
    const fileName = `paket-${uuidv4()}`;
    const uploadResult = await uploadImage(fileBuffer, fileName);
    
    paketData.url_gambar_cdn = uploadResult.url;
    paketData.gambar_public_id = uploadResult.public_id;
    paketData.gambar_metadata = uploadResult.metadata;
  }

  const paket = await PaketWisata.create(paketData);
  return paket;
};

const updatePaket = async (id, data, userId, fileBuffer = null) => {
  const paket = await getPaketById(id);
  
  const updateData = {
    ...data,
    updated_by: userId
  };

  // Auto-generate slug if nama_paket changed and slug not provided
  if (data.nama_paket && !data.slug) {
    let baseSlug = generateSlug(data.nama_paket);
    let slug = baseSlug;
    let counter = 1;
    
    // Check for uniqueness (exclude current paket)
    while (await PaketWisata.findOne({ 
      where: { 
        slug, 
        deleted_at: null,
        id_paket: { [Op.ne]: id }
      } 
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    updateData.slug = slug;
  }

  // Upload new image if provided
  if (fileBuffer) {
    // Delete old image from Cloudinary
    if (paket.gambar_public_id) {
      try {
        await deleteImage(paket.gambar_public_id);
        console.log('Old image deleted successfully');
      } catch (error) {
        console.error('Error deleting old image:', error.message);
      }
    }

    const fileName = `paket-${uuidv4()}`;
    const uploadResult = await uploadImage(fileBuffer, fileName);
    
    updateData.url_gambar_cdn = uploadResult.url;
    updateData.gambar_public_id = uploadResult.public_id;
    updateData.gambar_metadata = uploadResult.metadata;
  }

  await paket.update(updateData);
  return paket;
};

const deletePaket = async (id, userId) => {
  const paket = await getPaketById(id);

  if (paket.gambar_public_id) {
    try {
      await deleteImage(paket.gambar_public_id);
      console.log('Image deleted successfully from Cloudinary');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error.message);
    }
  }
  
  await paket.update({
    deleted_by: userId
  });
  await paket.destroy();
  return paket;
};

module.exports = {
  getAllPaket,
  getPaketById,
  getPaketGaleri,
  getPaketKuota,
  createPaket,
  updatePaket,
  deletePaket
};
