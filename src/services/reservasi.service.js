const { Reservasi, Wisatawan, PaketWisata, Admin, KetersediaanKuota, Pembayaran, Tiket } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const generateBookingCode = require('../utils/generateBookingCode');

const getAllReservasi = async (filters) => {
  const { page = 1, limit = 10, status_reservasi, tipe_reservasi, tanggal_kunjungan, id_paket, sort = 'waktu_dibuat', order = 'DESC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (status_reservasi) {
    where.status_reservasi = status_reservasi;
  }

  if (tipe_reservasi) {
    where.tipe_reservasi = tipe_reservasi;
  }

  if (tanggal_kunjungan) {
    where.tanggal_kunjungan = tanggal_kunjungan;
  }

  if (id_paket) {
    where.id_paket = parseInt(id_paket);
  }

  const { count, rows } = await Reservasi.findAndCountAll({
    where,
    include: [
      {
        model: Wisatawan,
        as: 'wisatawan',
        attributes: ['id_wisatawan', 'nama_lengkap', 'email', 'no_whatsapp']
      },
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'harga_per_pax']
      },
      {
        model: Admin,
        as: 'admin',
        attributes: ['id_admin', 'nama_lengkap'],
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

const getReservasiById = async (id) => {
  const reservasi = await Reservasi.findByPk(id, {
    include: [
      {
        model: Wisatawan,
        as: 'wisatawan',
        attributes: ['id_wisatawan', 'nama_lengkap', 'email', 'no_whatsapp']
      },
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'harga_per_pax', 'deskripsi_paket']
      },
      {
        model: Admin,
        as: 'admin',
        attributes: ['id_admin', 'nama_lengkap'],
        required: false
      },
      {
        model: Pembayaran,
        as: 'pembayaran'
      },
      {
        model: Tiket,
        as: 'tiket'
      }
    ]
  });
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return reservasi;
};

const getReservasiByKodeBooking = async (kode_booking) => {
  const reservasi = await Reservasi.findOne({
    where: { kode_booking },
    include: [
      {
        model: Wisatawan,
        as: 'wisatawan',
        attributes: ['id_wisatawan', 'nama_lengkap', 'email', 'no_whatsapp']
      },
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'harga_per_pax']
      }
    ]
  });
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return reservasi;
};

const createReservasi = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const paket = await PaketWisata.findByPk(data.id_paket);
    if (!paket) {
      const error = new Error('Paket wisata tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    const kuota = await KetersediaanKuota.findOne({
      where: {
        id_paket: data.id_paket,
        tanggal: data.tanggal_kunjungan
      },
      transaction
    });

    if (!kuota) {
      const error = new Error('Kuota untuk tanggal tersebut tidak tersedia');
      error.statusCode = 400;
      throw error;
    }

    if (data.jumlah_pax > kuota.sisa_kuota) {
      const error = new Error(`Kuota tidak mencukupi. Sisa kuota: ${kuota.sisa_kuota}`);
      error.statusCode = 400;
      throw error;
    }

    const total_harga = paket.harga_per_pax * data.jumlah_pax;
    const kode_booking = generateBookingCode();

    const reservasi = await Reservasi.create({
      kode_booking,
      id_wisatawan: data.id_wisatawan,
      id_paket: data.id_paket,
      id_admin: data.id_admin || null,
      tanggal_kunjungan: data.tanggal_kunjungan,
      jumlah_pax: data.jumlah_pax,
      total_harga,
      tipe_reservasi: data.tipe_reservasi || 'online',
      status_reservasi: 'pending',
      waktu_dibuat: new Date()
    }, { transaction });

    await kuota.update({
      sisa_kuota: kuota.sisa_kuota - data.jumlah_pax
    }, { transaction });

    await transaction.commit();

    await reservasi.reload({
      include: [
        {
          model: Wisatawan,
          as: 'wisatawan',
          attributes: ['id_wisatawan', 'nama_lengkap', 'email', 'no_whatsapp']
        },
        {
          model: PaketWisata,
          as: 'paket',
          attributes: ['id_paket', 'nama_paket', 'harga_per_pax']
        }
      ]
    });

    return reservasi;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateReservasi = async (id, data) => {
  const reservasi = await getReservasiById(id);
  
  await reservasi.update(data);
  await reservasi.reload({
    include: [
      {
        model: Wisatawan,
        as: 'wisatawan',
        attributes: ['id_wisatawan', 'nama_lengkap', 'email', 'no_whatsapp']
      },
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'harga_per_pax']
      },
      {
        model: Admin,
        as: 'admin',
        attributes: ['id_admin', 'nama_lengkap'],
        required: false
      }
    ]
  });
  
  return reservasi;
};

const updateReservasiStatus = async (id, new_status) => {
  const transaction = await sequelize.transaction();

  try {
    const reservasi = await Reservasi.findByPk(id, { transaction });
    
    if (!reservasi) {
      const error = new Error('Reservasi tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    const old_status = reservasi.status_reservasi;

    if (old_status !== 'cancelled' && new_status === 'cancelled') {
      const kuota = await KetersediaanKuota.findOne({
        where: {
          id_paket: reservasi.id_paket,
          tanggal: reservasi.tanggal_kunjungan
        },
        transaction
      });

      if (kuota) {
        await kuota.update({
          sisa_kuota: kuota.sisa_kuota + reservasi.jumlah_pax
        }, { transaction });
      }
    }

    await reservasi.update({ status_reservasi: new_status }, { transaction });

    await transaction.commit();

    await reservasi.reload({
      include: [
        {
          model: Wisatawan,
          as: 'wisatawan',
          attributes: ['id_wisatawan', 'nama_lengkap', 'email', 'no_whatsapp']
        },
        {
          model: PaketWisata,
          as: 'paket',
          attributes: ['id_paket', 'nama_paket', 'harga_per_pax']
        }
      ]
    });

    return reservasi;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteReservasi = async (id) => {
  const reservasi = await Reservasi.findByPk(id);
  
  if (!reservasi) {
    const error = new Error('Reservasi tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  
  await reservasi.destroy();
  return reservasi;
};

module.exports = {
  getAllReservasi,
  getReservasiById,
  getReservasiByKodeBooking,
  createReservasi,
  updateReservasi,
  updateReservasiStatus,
  deleteReservasi
};
