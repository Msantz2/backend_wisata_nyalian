const { Wisatawan, Reservasi, PaketWisata } = require('../models');
const { Op } = require('sequelize');

const getAllWisatawan = async (filters) => {
  const { page = 1, limit = 10, search, sort = 'id_wisatawan', order = 'ASC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where[Op.or] = [
      { nama_lengkap: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Wisatawan.findAndCountAll({
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

const getWisatawanById = async (id) => {
  const wisatawan = await Wisatawan.findByPk(id);
  
  if (!wisatawan) {
    const error = new Error('Wisatawan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return wisatawan;
};

const getWisatawanReservasi = async (id_wisatawan) => {
  const wisatawan = await getWisatawanById(id_wisatawan);
  
  const reservasi = await Reservasi.findAll({
    where: { id_wisatawan },
    include: [
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'harga_per_pax']
      }
    ],
    order: [['waktu_dibuat', 'DESC']]
  });

  return reservasi;
};

const createWisatawan = async (data) => {
  const wisatawan = await Wisatawan.create(data);
  return wisatawan;
};

const updateWisatawan = async (id, data) => {
  const wisatawan = await getWisatawanById(id);
  
  await wisatawan.update(data);
  return wisatawan;
};

const deleteWisatawan = async (id) => {
  const wisatawan = await getWisatawanById(id);
  
  await wisatawan.destroy();
  return wisatawan;
};

module.exports = {
  getAllWisatawan,
  getWisatawanById,
  getWisatawanReservasi,
  createWisatawan,
  updateWisatawan,
  deleteWisatawan
};
