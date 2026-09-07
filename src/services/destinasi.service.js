const { Destinasi, KategoriDestinasi, GaleriFoto } = require('../models');
const { Op } = require('sequelize');
const { uploadAndGetThumbnail, deleteImage } = require('./cloudinaryService');
const { v4: uuidv4 } = require('uuid');
const { generateSlug } = require('../utils/generateSlug');

const getAllDestinasi = async (filters) => {
  const { page = 1, limit = 10, search, id_kategori, featured = false, sort = 'id_destinasi', order = 'ASC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = { deleted_at: null }; // Exclude soft-deleted records

  if (search) {
    where[Op.or] = [
      { nama_destinasi: { [Op.iLike]: `%${search}%` } },
      { deskripsi: { [Op.iLike]: `%${search}%` } }
    ];
  }

  if (id_kategori) {
    where.id_kategori = parseInt(id_kategori);
  }

  // Add featured filter if specified
  if (featured === true || featured === 'true') {
    where.featured = true;
  }

  const { count, rows } = await Destinasi.findAndCountAll({
    where,
    include: [
      {
        model: KategoriDestinasi,
        as: 'kategori',
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

const getDestinasiById = async (id) => {
  const destinasi = await Destinasi.findByPk(id, {
    include: [
      {
        model: KategoriDestinasi,
        as: 'kategori',
        attributes: ['id_kategori', 'nama_kategori', 'deskripsi_kategori']
      }
    ]
  });
  
  if (!destinasi) {
    const error = new Error('Destinasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return destinasi;
};

const getDestinasiBySlug = async (slug) => {
  const destinasi = await Destinasi.findOne({
    where: { slug, deleted_at: null },
    include: [
      {
        model: KategoriDestinasi,
        as: 'kategori',
        attributes: ['id_kategori', 'nama_kategori', 'deskripsi_kategori']
      }
    ]
  });
  
  if (!destinasi) {
    const error = new Error('Destinasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return destinasi;
};

const getDestinasiGaleri = async (id_destinasi) => {
  const destinasi = await Destinasi.findByPk(id_destinasi);
  
  if (!destinasi) {
    const error = new Error('Destinasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  
  const galeri = await GaleriFoto.findAll({
    where: { id_destinasi }
  });

  return galeri;
};

const createDestinasi = async (data, userId, fileBuffer = null) => {
  const destinasiData = {
    ...data,
    created_by: userId
  };

  if (!destinasiData.slug && destinasiData.nama_destinasi) {
    destinasiData.slug = generateSlug(destinasiData.nama_destinasi);
  }

  if (fileBuffer) {
    const fileName = `destinasi-${uuidv4()}`;
    const uploadResult = await uploadAndGetThumbnail(fileBuffer, fileName);
    
    destinasiData.url_gambar_cdn = uploadResult.url;
    destinasiData.gambar_public_id = uploadResult.public_id;
    destinasiData.gambar_metadata = uploadResult.metadata;
  }

  const destinasi = await Destinasi.create(destinasiData);
  return destinasi;
};

const updateDestinasi = async (id, data, userId, fileBuffer = null) => {
  const destinasi = await getDestinasiById(id);
  
  const updateData = {
    ...data,
    updated_by: userId
  };

  if (updateData.nama_destinasi && (!updateData.slug || updateData.slug.trim() === '')) {
    updateData.slug = generateSlug(updateData.nama_destinasi);
  }

  if (fileBuffer) {
    if (destinasi.gambar_public_id) {
      try {
        await deleteImage(destinasi.gambar_public_id);
        console.log('Old image deleted successfully');
      } catch (error) {
        console.error('Error deleting old image:', error.message);
      }
    }

    const fileName = `destinasi-${uuidv4()}`;
    const uploadResult = await uploadAndGetThumbnail(fileBuffer, fileName);
    
    updateData.url_gambar_cdn = uploadResult.url;
    updateData.gambar_public_id = uploadResult.public_id;
    updateData.gambar_metadata = uploadResult.metadata;
  }

  await destinasi.update(updateData);
  await destinasi.reload({
    include: [
      {
        model: KategoriDestinasi,
        as: 'kategori',
        attributes: ['id_kategori', 'nama_kategori', 'deskripsi_kategori']
      }
    ]
  });
  
  return destinasi;
};

const deleteDestinasi = async (id, userId) => {
  const destinasi = await Destinasi.findByPk(id);
  
  if (!destinasi) {
    const error = new Error('Destinasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (destinasi.gambar_public_id) {
    try {
      await deleteImage(destinasi.gambar_public_id);
      console.log('Image deleted successfully from Cloudinary');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error.message);
    }
  }
  
  await destinasi.update({
    deleted_by: userId
  });
  await destinasi.destroy();
  return destinasi;
};

module.exports = {
  getAllDestinasi,
  getDestinasiById,
  getDestinasiBySlug,
  getDestinasiGaleri,
  createDestinasi,
  updateDestinasi,
  deleteDestinasi
};
