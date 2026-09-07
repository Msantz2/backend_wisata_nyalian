const { GaleriFoto, Destinasi, PaketWisata } = require('../models');
const { Op } = require('sequelize');
const { uploadAndGetThumbnail, deleteImage } = require('./cloudinaryService');
const { v4: uuidv4 } = require('uuid');

const getAllGaleri = async (filters) => {
  const { page = 1, limit = 10, id_destinasi, sort = 'urutan', order = 'ASC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (id_destinasi) {
    where.id_destinasi = parseInt(id_destinasi);
  }

  const { count, rows } = await GaleriFoto.findAndCountAll({
    where,
    include: [
      {
        model: Destinasi,
        as: 'destinasi',
        attributes: ['id_destinasi', 'nama_destinasi'],
        required: false
      }
    ],
    limit: parseInt(limit),
    offset,
    order: [[sort, order.toUpperCase()]]
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

const getGaleriById = async (id) => {
  const galeri = await GaleriFoto.findByPk(id, {
    include: [
      {
        model: Destinasi,
        as: 'destinasi',
        attributes: ['id_destinasi', 'nama_destinasi'],
        required: false
      }
    ]
  });
  
  if (!galeri) {
    const error = new Error('Foto galeri tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return galeri;
};

const createGaleri = async (data, userId, fileBuffer = null) => {
  if (!data.id_destinasi || isNaN(data.id_destinasi)) {
    const error = new Error('id_destinasi harus diisi');
    error.statusCode = 400;
    throw error;
  }

  const galeriData = {
    ...data,
    created_by: userId
  };

  if (fileBuffer) {
    const fileName = `galeri-${uuidv4()}`;
    const uploadResult = await uploadAndGetThumbnail(fileBuffer, fileName);
    
    galeriData.url_foto_cdn = uploadResult.url;
    galeriData.url_thumbnail_cdn = uploadResult.thumbnail_url;
    galeriData.foto_public_id = uploadResult.public_id;
    galeriData.foto_metadata = uploadResult.metadata;
  }

  const galeri = await GaleriFoto.create(galeriData);
  
  await galeri.reload({
    include: [
      {
        model: Destinasi,
        as: 'destinasi',
        attributes: ['id_destinasi', 'nama_destinasi'],
        required: false
      }
    ]
  });
  
  return galeri;
};

const updateGaleri = async (id, data, userId, fileBuffer = null) => {
  const galeri = await getGaleriById(id);
  
  const updateData = {
    ...data,
    updated_by: userId
  };

  if (fileBuffer) {
    if (galeri.foto_public_id) {
      try {
        await deleteImage(galeri.foto_public_id);
        console.log('Old image deleted successfully');
      } catch (error) {
        console.error('Error deleting old image:', error.message);
      }
    }

    const fileName = `galeri-${uuidv4()}`;
    const uploadResult = await uploadAndGetThumbnail(fileBuffer, fileName);
    
    updateData.url_foto_cdn = uploadResult.url;
    updateData.url_thumbnail_cdn = uploadResult.thumbnail_url;
    updateData.foto_public_id = uploadResult.public_id;
    updateData.foto_metadata = uploadResult.metadata;
  }

  await galeri.update(updateData);
  await galeri.reload({
    include: [
      {
        model: Destinasi,
        as: 'destinasi',
        attributes: ['id_destinasi', 'nama_destinasi'],
        required: false
      }
    ]
  });
  
  return galeri;
};

const deleteGaleri = async (id, userId) => {
  const galeri = await GaleriFoto.findByPk(id);
  
  if (!galeri) {
    const error = new Error('Foto galeri tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (galeri.foto_public_id) {
    try {
      await deleteImage(galeri.foto_public_id);
      console.log('Image deleted successfully from Cloudinary');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error.message);
    }
  }
  
  await galeri.update({
    deleted_by: userId
  });
  await galeri.destroy();
  return galeri;
};

const createBulkGaleri = async (id_destinasi, files, userId) => {
  if (!id_destinasi || isNaN(id_destinasi)) {
    const error = new Error('id_destinasi harus diisi');
    error.statusCode = 400;
    throw error;
  }

  if (!files || files.length === 0) {
    const error = new Error('Minimal 1 foto harus diupload');
    error.statusCode = 400;
    throw error;
  }

  const destinasi = await Destinasi.findByPk(id_destinasi);
  if (!destinasi) {
    const error = new Error('Destinasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const createdGaleri = [];
  let urutan = 0;

  for (const file of files) {
    try {
      const fileName = `galeri-${uuidv4()}`;
      const uploadResult = await uploadAndGetThumbnail(file.buffer, fileName);
      
      const galeriData = {
        id_destinasi,
        url_foto_cdn: uploadResult.url,
        caption: file.caption || null,
        alt_text: file.alt_text || null,
        urutan: urutan++,
        created_by: userId,
        foto_public_id: uploadResult.public_id,
        foto_metadata: uploadResult.metadata
      };

      const galeri = await GaleriFoto.create(galeriData);
      createdGaleri.push(galeri);
    } catch (error) {
      console.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  return {
    data: createdGaleri,
    meta: {
      total: createdGaleri.length,
      message: `${createdGaleri.length} foto galeri berhasil ditambahkan`
    }
  };
};

module.exports = {
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
  createBulkGaleri
};
