const { UlasanWisatawan, Reservasi, Wisatawan, PaketWisata } = require('../models');
const { Op } = require('sequelize');

const getAllUlasan = async (filters) => {
  const { page = 1, limit = 10, rating_bintang, id_paket, sort = 'tanggal_ulasan', order = 'DESC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};
  const includeReservasi = {
    model: Reservasi,
    as: 'reservasi',
    attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan'],
    include: [
      {
        model: Wisatawan,
        as: 'wisatawan',
        attributes: ['id_wisatawan', 'nama_lengkap']
      },
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket']
      }
    ]
  };

  if (rating_bintang) {
    where.rating_bintang = parseInt(rating_bintang);
  }

  if (id_paket) {
    includeReservasi.where = { id_paket: parseInt(id_paket) };
    includeReservasi.required = true;
  }

  const { count, rows } = await UlasanWisatawan.findAndCountAll({
    where,
    include: [includeReservasi],
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

const getUlasanById = async (id) => {
  const ulasan = await UlasanWisatawan.findByPk(id, {
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan', 'status_reservasi'],
        include: [
          {
            model: Wisatawan,
            as: 'wisatawan',
            attributes: ['id_wisatawan', 'nama_lengkap', 'email']
          },
          {
            model: PaketWisata,
            as: 'paket',
            attributes: ['id_paket', 'nama_paket']
          }
        ]
      }
    ]
  });
  
  if (!ulasan) {
    const error = new Error('Ulasan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return ulasan;
};

const getUlasanByReservasi = async (id_reservasi) => {
  const reservasi = await Reservasi.findByPk(id_reservasi);
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const ulasan = await UlasanWisatawan.findOne({
    where: { id_reservasi },
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan', 'status_reservasi']
      }
    ]
  });

  return ulasan;
};

const createUlasan = async (data) => {
  const reservasi = await Reservasi.findByPk(data.id_reservasi);
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (reservasi.status_reservasi !== 'completed') {
    const error = new Error('Ulasan hanya dapat dibuat untuk reservasi dengan status completed');
    error.statusCode = 400;
    throw error;
  }

  const existingUlasan = await UlasanWisatawan.findOne({
    where: { id_reservasi: data.id_reservasi }
  });

  if (existingUlasan) {
    const error = new Error('Ulasan untuk reservasi ini sudah ada');
    error.statusCode = 409;
    throw error;
  }

  const ulasan = await UlasanWisatawan.create({
    ...data,
    tanggal_ulasan: new Date()
  });

  await ulasan.reload({
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan', 'status_reservasi'],
        include: [
          {
            model: Wisatawan,
            as: 'wisatawan',
            attributes: ['id_wisatawan', 'nama_lengkap']
          },
          {
            model: PaketWisata,
            as: 'paket',
            attributes: ['id_paket', 'nama_paket']
          }
        ]
      }
    ]
  });
  
  return ulasan;
};

const updateUlasan = async (id, data) => {
  const ulasan = await getUlasanById(id);
  
  await ulasan.update(data);
  await ulasan.reload({
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan', 'status_reservasi'],
        include: [
          {
            model: Wisatawan,
            as: 'wisatawan',
            attributes: ['id_wisatawan', 'nama_lengkap']
          },
          {
            model: PaketWisata,
            as: 'paket',
            attributes: ['id_paket', 'nama_paket']
          }
        ]
      }
    ]
  });
  
  return ulasan;
};

const deleteUlasan = async (id) => {
  const ulasan = await UlasanWisatawan.findByPk(id);
  
  if (!ulasan) {
    const error = new Error('Ulasan tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  
  await ulasan.destroy();
  return ulasan;
};

module.exports = {
  getAllUlasan,
  getUlasanById,
  getUlasanByReservasi,
  createUlasan,
  updateUlasan,
  deleteUlasan
};
