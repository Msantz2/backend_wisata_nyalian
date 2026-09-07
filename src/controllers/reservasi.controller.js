const reservasiService = require('../services/reservasi.service');
const { successResponse } = require('../utils/response');

const getAllReservasi = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await reservasiService.getAllReservasi(filters);
    
    return successResponse(res, 200, 'Data reservasi berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getReservasiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservasi = await reservasiService.getReservasiById(id);
    
    return successResponse(res, 200, 'Detail reservasi berhasil diambil', reservasi);
  } catch (error) {
    next(error);
  }
};

const getReservasiByKodeBooking = async (req, res, next) => {
  try {
    const { kode_booking } = req.params;
    const reservasi = await reservasiService.getReservasiByKodeBooking(kode_booking);
    
    return successResponse(res, 200, 'Reservasi berhasil ditemukan', reservasi);
  } catch (error) {
    next(error);
  }
};

const createReservasi = async (req, res, next) => {
  try {
    const reservasi = await reservasiService.createReservasi(req.body);
    
    return successResponse(res, 201, 'Reservasi berhasil dibuat', reservasi);
  } catch (error) {
    next(error);
  }
};

const updateReservasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservasi = await reservasiService.updateReservasi(id, req.body);
    
    return successResponse(res, 200, 'Reservasi berhasil diupdate', reservasi);
  } catch (error) {
    next(error);
  }
};

const updateReservasiStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status_reservasi } = req.body;
    const reservasi = await reservasiService.updateReservasiStatus(id, status_reservasi);
    
    return successResponse(res, 200, 'Status reservasi berhasil diupdate', reservasi);
  } catch (error) {
    next(error);
  }
};

const deleteReservasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    await reservasiService.deleteReservasi(id);
    
    return successResponse(res, 200, 'Reservasi berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
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
