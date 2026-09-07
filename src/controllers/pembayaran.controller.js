const pembayaranService = require('../services/pembayaran.service');
const { successResponse } = require('../utils/response');

const getAllPembayaran = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await pembayaranService.getAllPembayaran(filters);
    
    return successResponse(res, 200, 'Data pembayaran berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getPembayaranById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pembayaran = await pembayaranService.getPembayaranById(id);
    
    return successResponse(res, 200, 'Detail pembayaran berhasil diambil', pembayaran);
  } catch (error) {
    next(error);
  }
};

const getPembayaranByReservasi = async (req, res, next) => {
  try {
    const { id_reservasi } = req.params;
    const pembayaran = await pembayaranService.getPembayaranByReservasi(id_reservasi);
    
    return successResponse(res, 200, 'Data pembayaran reservasi berhasil diambil', pembayaran);
  } catch (error) {
    next(error);
  }
};

const createPembayaran = async (req, res, next) => {
  try {
    const pembayaran = await pembayaranService.createPembayaran(req.body, req.user?.id_admin);
    
    return successResponse(res, 201, 'Pembayaran berhasil dicatat', pembayaran);
  } catch (error) {
    next(error);
  }
};

const updatePembayaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pembayaran = await pembayaranService.updatePembayaran(id, req.body, req.user?.id_admin);
    
    return successResponse(res, 200, 'Pembayaran berhasil diupdate', pembayaran);
  } catch (error) {
    next(error);
  }
};

const deletePembayaran = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pembayaranService.deletePembayaran(id);
    
    return successResponse(res, 200, 'Pembayaran berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPembayaran,
  getPembayaranById,
  getPembayaranByReservasi,
  createPembayaran,
  updatePembayaran,
  deletePembayaran
};
