const { Pembayaran, Reservasi, Wisatawan, PaketWisata } = require('../models');
const { Op } = require('sequelize');

const getAllPembayaran = async (filters) => {
  const { page = 1, limit = 10, id_reservasi, status_pembayaran, sort = 'waktu_bayar', order = 'DESC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (id_reservasi) {
    where.id_reservasi = parseInt(id_reservasi);
  }

  if (status_pembayaran) {
    where.status_pembayaran = status_pembayaran;
  }

  const { count, rows } = await Pembayaran.findAndCountAll({
    where,
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'total_harga', 'status_reservasi'],
        include: [
          {
            model: Wisatawan,
            as: 'wisatawan',
            attributes: ['id_wisatawan', 'nama_lengkap']
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

const getPembayaranById = async (id) => {
  const pembayaran = await Pembayaran.findByPk(id, {
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'total_harga', 'status_reservasi'],
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
  
  if (!pembayaran) {
    const error = new Error('Pembayaran tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return pembayaran;
};

const getPembayaranByReservasi = async (id_reservasi) => {
  const reservasi = await Reservasi.findByPk(id_reservasi);
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const pembayaran = await Pembayaran.findAll({
    where: { id_reservasi },
    order: [['waktu_bayar', 'DESC']]
  });

  return pembayaran;
};

const createPembayaran = async (data, userId = null) => {
  const reservasi = await Reservasi.findByPk(data.id_reservasi);
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const pembayaranData = {
    id_reservasi: data.id_reservasi,
    metode_bayar: data.metode_bayar,
    bukti_transfer: data.bukti_transfer,
    status_pembayaran: data.status_pembayaran || 'pending',
    waktu_bayar: data.waktu_bayar || new Date(),
    created_by: userId
  };

  const pembayaran = await Pembayaran.create(pembayaranData);

  await pembayaran.reload({
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'total_harga', 'status_reservasi']
      }
    ]
  });
  
  return pembayaran;
};

const updatePembayaran = async (id, data, userId = null) => {
  const pembayaran = await getPembayaranById(id);
  
  const updateData = { ...data };
  if (userId) {
    updateData.updated_by = userId;
  }
  
  await pembayaran.update(updateData);
  await pembayaran.reload({
    include: [
      {
        model: Reservasi,
        as: 'reservasi',
        attributes: ['id_reservasi', 'kode_booking', 'total_harga', 'status_reservasi']
      }
    ]
  });
  
  return pembayaran;
};

const deletePembayaran = async (id) => {
  const pembayaran = await Pembayaran.findByPk(id);
  
  if (!pembayaran) {
    const error = new Error('Pembayaran tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  
  await pembayaran.destroy();
  return pembayaran;
};

module.exports = {
  getAllPembayaran,
  getPembayaranById,
  getPembayaranByReservasi,
  createPembayaran,
  updatePembayaran,
  deletePembayaran
};
