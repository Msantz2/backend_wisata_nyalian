const tiketService = require('../services/tiket.service');
const { successResponse } = require('../utils/response');

const getAllTiket = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await tiketService.getAllTiket(filters);
    
    return successResponse(res, 200, 'Data tiket berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getTiketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tiket = await tiketService.getTiketById(id);
    
    return successResponse(res, 200, 'Detail tiket berhasil diambil', tiket);
  } catch (error) {
    next(error);
  }
};

const getTiketByReservasi = async (req, res, next) => {
  try {
    const { id_reservasi } = req.params;
    const tiket = await tiketService.getTiketByReservasi(id_reservasi);
    
    return successResponse(res, 200, 'Data tiket reservasi berhasil diambil', tiket);
  } catch (error) {
    next(error);
  }
};

const createTiket = async (req, res, next) => {
  try {
    const tiket = await tiketService.createTiket(req.body, req.user?.id_admin);
    
    return successResponse(res, 201, 'Tiket berhasil dibuat', tiket);
  } catch (error) {
    next(error);
  }
};

const scanTiket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tiket = await tiketService.scanTiket(id, req.user?.id_admin);
    
    return successResponse(res, 200, 'Tiket berhasil di-scan', tiket);
  } catch (error) {
    next(error);
  }
};

const deleteTiket = async (req, res, next) => {
  try {
    const { id } = req.params;
    await tiketService.deleteTiket(id);
    
    return successResponse(res, 200, 'Tiket berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTiket,
  getTiketById,
  getTiketByReservasi,
  createTiket,
  scanTiket,
  deleteTiket
};
