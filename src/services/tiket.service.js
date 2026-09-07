const { Tiket, Reservasi, Wisatawan, PaketWisata } = require('../models');
const { Op } = require('sequelize');
const generateQrToken = require('../utils/generateQrToken');

const getAllTiket = async (filters) => {
  const { page = 1, limit = 10, status_tiket, sort = 'id_tiket', order = 'DESC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (status_tiket) {
    where.status_tiket = status_tiket;
  }

  const { count, rows } = await Tiket.findAndCountAll({
    where,
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

const getTiketById = async (id) => {
  const tiket = await Tiket.findByPk(id, {
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan', 'status_reservasi'],
        include: [
          {
            model: Wisatawan,
            as: 'wisatawan',
            attributes: ['id_wisatawan', 'nama_lengkap', 'email', 'no_whatsapp']
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
  
  if (!tiket) {
    const error = new Error('Tiket tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return tiket;
};

const getTiketByReservasi = async (id_reservasi) => {
  const reservasi = await Reservasi.findByPk(id_reservasi);
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const tiket = await Tiket.findAll({
    where: { id_reservasi },
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan', 'status_reservasi']
      }
    ]
  });

  return tiket;
};

const generateNomorTiket = async () => {
  const count = await Tiket.count();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const sequence = String(count + 1).padStart(6, '0');
  return `TK-${year}${month}${day}-${sequence}`;
};

const createTiket = async (data, userId = null) => {
  const reservasi = await Reservasi.findByPk(data.id_reservasi);
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (reservasi.status_reservasi !== 'confirmed') {
    const error = new Error('Tiket hanya dapat dibuat untuk reservasi dengan status confirmed');
    error.statusCode = 400;
    throw error;
  }

  const kode_qr_token = generateQrToken();

  const tiket = await Tiket.create({
    id_reservasi: data.id_reservasi,
    kode_qr_token,
    status_tiket: 'Belum Digunakan',
    waktu_scan: null,
    created_by: userId
  });

  await tiket.reload({
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'tanggal_kunjungan', 'status_reservasi']
      }
    ]
  });
  
  return tiket;
};

const scanTiket = async (id, userId = null) => {
  const tiket = await getTiketById(id);
  
  if (tiket.status_tiket === 'Sudah Digunakan') {
    const error = new Error('Tiket sudah pernah digunakan');
    error.statusCode = 400;
    throw error;
  }

  if (tiket.status_tiket === 'Kadaluarsa') {
    const error = new Error('Tiket sudah kadaluarsa');
    error.statusCode = 400;
    throw error;
  }

  await tiket.update({
    status_tiket: 'Sudah Digunakan',
    waktu_scan: new Date(),
    updated_by: userId
  });

  await tiket.reload({
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
  
  return tiket;
};

const deleteTiket = async (id) => {
  const tiket = await Tiket.findByPk(id);
  
  if (!tiket) {
    const error = new Error('Tiket tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  
  await tiket.destroy();
  return tiket;
};

module.exports = {
  getAllTiket,
  getTiketById,
  getTiketByReservasi,
  createTiket,
  scanTiket,
  deleteTiket
};
