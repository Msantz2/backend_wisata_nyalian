const wisatawanService = require('../services/wisatawan.service');
const { successResponse } = require('../utils/response');

const getAllWisatawan = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await wisatawanService.getAllWisatawan(filters);
    
    return successResponse(res, 200, 'Data wisatawan berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getWisatawanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const wisatawan = await wisatawanService.getWisatawanById(id);
    
    return successResponse(res, 200, 'Detail wisatawan berhasil diambil', wisatawan);
  } catch (error) {
    next(error);
  }
};

const getWisatawanReservasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservasi = await wisatawanService.getWisatawanReservasi(id);
    
    return successResponse(res, 200, 'Riwayat reservasi wisatawan berhasil diambil', reservasi);
  } catch (error) {
    next(error);
  }
};

const createWisatawan = async (req, res, next) => {
  try {
    const wisatawan = await wisatawanService.createWisatawan(req.body);
    
    return successResponse(res, 201, 'Wisatawan berhasil didaftarkan', wisatawan);
  } catch (error) {
    next(error);
  }
};

const updateWisatawan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const wisatawan = await wisatawanService.updateWisatawan(id, req.body);
    
    return successResponse(res, 200, 'Data wisatawan berhasil diupdate', wisatawan);
  } catch (error) {
    next(error);
  }
};

const deleteWisatawan = async (req, res, next) => {
  try {
    const { id } = req.params;
    await wisatawanService.deleteWisatawan(id);
    
    return successResponse(res, 200, 'Wisatawan berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWisatawan,
  getWisatawanById,
  getWisatawanReservasi,
  createWisatawan,
  updateWisatawan,
  deleteWisatawan
};
