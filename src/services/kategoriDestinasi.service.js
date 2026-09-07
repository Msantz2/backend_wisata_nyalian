const { KategoriDestinasi } = require('../models');
const { Op } = require('sequelize');

const getAllKategori = async (filters) => {
  const { page = 1, limit = 10, search, sort = 'id_kategori', order = 'ASC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where.nama_kategori = {
      [Op.iLike]: `%${search}%`
    };
  }

  const { count, rows } = await KategoriDestinasi.findAndCountAll({
    where,
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

const getKategoriById = async (id) => {
  const kategori = await KategoriDestinasi.findByPk(id);
  
  if (!kategori) {
    const error = new Error('Kategori tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return kategori;
};

const createKategori = async (data, userId) => {
  const kategori = await KategoriDestinasi.create({
    ...data,
    created_by: userId
  });
  return kategori;
};

const updateKategori = async (id, data, userId) => {
  const kategori = await getKategoriById(id);
  
  await kategori.update({
    ...data,
    updated_by: userId
  });
  return kategori;
};

const deleteKategori = async (id, userId) => {
  const kategori = await getKategoriById(id);
  await kategori.update({
    deleted_by: userId
  });
  await kategori.destroy();
  return kategori;
};

module.exports = {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori
};
