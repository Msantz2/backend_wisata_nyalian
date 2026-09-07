const { KetersediaanKuota, PaketWisata } = require('../models');
const { Op } = require('sequelize');

const getAllKuota = async (filters) => {
  const { page = 1, limit = 10, id_paket, tanggal, sort = 'tanggal', order = 'ASC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (id_paket) {
    where.id_paket = parseInt(id_paket);
  }

  if (tanggal) {
    where.tanggal = tanggal;
  }

  const { count, rows } = await KetersediaanKuota.findAndCountAll({
    where,
    include: [
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'kuota_default']
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

const getKuotaById = async (id) => {
  const kuota = await KetersediaanKuota.findByPk(id, {
    include: [
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'kuota_default']
      }
    ]
  });
  
  if (!kuota) {
    const error = new Error('Data kuota tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return kuota;
};

const createKuota = async (data) => {
  const kuota = await KetersediaanKuota.create(data);
  
  await kuota.reload({
    include: [
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'kuota_default']
      }
    ]
  });
  
  return kuota;
};

const updateKuota = async (id, data) => {
  const kuota = await getKuotaById(id);
  
  await kuota.update(data);
  await kuota.reload({
    include: [
      {
        model: PaketWisata,
        as: 'paket',
        attributes: ['id_paket', 'nama_paket', 'kuota_default']
      }
    ]
  });
  
  return kuota;
};

const deleteKuota = async (id) => {
  const kuota = await KetersediaanKuota.findByPk(id);
  
  if (!kuota) {
    const error = new Error('Data kuota tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  
  await kuota.destroy();
  return kuota;
};

module.exports = {
  getAllKuota,
  getKuotaById,
  createKuota,
  updateKuota,
  deleteKuota
};
