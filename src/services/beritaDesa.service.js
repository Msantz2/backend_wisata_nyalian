const { BeritaDesa, Admin } = require('../models');
const { Op } = require('sequelize');
const { uploadAndGetThumbnail, deleteImage } = require('./cloudinaryService');
const { v4: uuidv4 } = require('uuid');

const getAllBerita = async (filters) => {
  const { page = 1, limit = 10, search, status = 'published', featured = false, sort = 'tanggal_publikasi', order = 'DESC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = { deleted_at: null }; // Exclude soft-deleted records

  if (search) {
    where[Op.or] = [
      { judul_berita: { [Op.iLike]: `%${search}%` } },
      { isi_konten: { [Op.iLike]: `%${search}%` } }
    ];
  }

  // Filter by status (published/draft)
  if (status) {
    where.status = status;
  }

  // Add featured filter if specified
  if (featured === true || featured === 'true') {
    where.featured = true;
  }

  const { count, rows } = await BeritaDesa.findAndCountAll({
    where,
    include: [
      {
        model: Admin,
        as: 'admin',
        attributes: ['id_admin', 'nama_lengkap'],
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

const getBeritaById = async (id) => {
  const berita = await BeritaDesa.findByPk(id, {
    include: [
      {
        model: Admin,
        as: 'admin',
        attributes: ['id_admin', 'nama_lengkap']
      }
    ]
  });
  
  if (!berita) {
    const error = new Error('Berita tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return berita;
};

const createBerita = async (data, id_admin, userId, fileBuffer = null) => {
  const beritaData = {
    ...data,
    id_admin,
    tanggal_publikasi: new Date(),
    created_by: userId
  };

  if (fileBuffer) {
    const fileName = `berita-${uuidv4()}`;
    const uploadResult = await uploadAndGetThumbnail(fileBuffer, fileName);
    
    beritaData.url_gambar_cdn = uploadResult.url;
    beritaData.url_thumbnail_cdn = uploadResult.thumbnail_url;
    beritaData.gambar_public_id = uploadResult.public_id;
    beritaData.gambar_metadata = uploadResult.metadata;
  }

  const berita = await BeritaDesa.create(beritaData);

  await berita.reload({
    include: [
      {
        model: Admin,
        as: 'admin',
        attributes: ['id_admin', 'nama_lengkap']
      }
    ]
  });
  
  return berita;
};

const updateBerita = async (id, data, userId, fileBuffer = null) => {
  const berita = await getBeritaById(id);
  
  const updateData = {
    ...data,
    updated_by: userId
  };

  if (fileBuffer) {
    if (berita.gambar_public_id) {
      try {
        await deleteImage(berita.gambar_public_id);
        console.log('Old image deleted successfully');
      } catch (error) {
        console.error('Error deleting old image:', error.message);
      }
    }

    const fileName = `berita-${uuidv4()}`;
    const uploadResult = await uploadAndGetThumbnail(fileBuffer, fileName);
    
    updateData.url_gambar_cdn = uploadResult.url;
    updateData.url_thumbnail_cdn = uploadResult.thumbnail_url;
    updateData.gambar_public_id = uploadResult.public_id;
    updateData.gambar_metadata = uploadResult.metadata;
  }

  await berita.update(updateData);
  await berita.reload({
    include: [
      {
        model: Admin,
        as: 'admin',
        attributes: ['id_admin', 'nama_lengkap']
      }
    ]
  });
  
  return berita;
};

const deleteBerita = async (id, userId) => {
  const berita = await BeritaDesa.findByPk(id);
  
  if (!berita) {
    const error = new Error('Berita tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (berita.gambar_public_id) {
    try {
      await deleteImage(berita.gambar_public_id);
      console.log('Image deleted successfully from Cloudinary');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error.message);
    }
  }
  
  await berita.update({
    deleted_by: userId
  });
  await berita.destroy();
  return berita;
};

module.exports = {
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita
};
