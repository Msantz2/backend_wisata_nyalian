const ulasanWisatawanService = require('../services/ulasanWisatawan.service');
const { successResponse } = require('../utils/response');

const getAllUlasan = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await ulasanWisatawanService.getAllUlasan(filters);
    
    return successResponse(res, 200, 'Data ulasan berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getUlasanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ulasan = await ulasanWisatawanService.getUlasanById(id);
    
    return successResponse(res, 200, 'Detail ulasan berhasil diambil', ulasan);
  } catch (error) {
    next(error);
  }
};

const getUlasanByReservasi = async (req, res, next) => {
  try {
    const { id_reservasi } = req.params;
    const ulasan = await ulasanWisatawanService.getUlasanByReservasi(id_reservasi);
    
    return successResponse(res, 200, 'Ulasan reservasi berhasil diambil', ulasan);
  } catch (error) {
    next(error);
  }
};

const createUlasan = async (req, res, next) => {
  try {
    const ulasan = await ulasanWisatawanService.createUlasan(req.body);
    
    return successResponse(res, 201, 'Ulasan berhasil ditambahkan', ulasan);
  } catch (error) {
    next(error);
  }
};

const updateUlasan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ulasan = await ulasanWisatawanService.updateUlasan(id, req.body);
    
    return successResponse(res, 200, 'Ulasan berhasil diupdate', ulasan);
  } catch (error) {
    next(error);
  }
};

const deleteUlasan = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ulasanWisatawanService.deleteUlasan(id);
    
    return successResponse(res, 200, 'Ulasan berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUlasan,
  getUlasanById,
  getUlasanByReservasi,
  createUlasan,
  updateUlasan,
  deleteUlasan
};
