const kategoriDestinasiService = require('../services/kategoriDestinasi.service');
const { successResponse } = require('../utils/response');

const getAllKategori = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await kategoriDestinasiService.getAllKategori(filters);
    
    return successResponse(res, 200, 'Data kategori destinasi berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getKategoriById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kategori = await kategoriDestinasiService.getKategoriById(id);
    
    return successResponse(res, 200, 'Detail kategori destinasi berhasil diambil', kategori);
  } catch (error) {
    next(error);
  }
};

const createKategori = async (req, res, next) => {
  try {
    const kategori = await kategoriDestinasiService.createKategori(req.body, req.user.id_admin);
    
    return successResponse(res, 201, 'Kategori destinasi berhasil ditambahkan', kategori);
  } catch (error) {
    next(error);
  }
};

const updateKategori = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kategori = await kategoriDestinasiService.updateKategori(id, req.body, req.user.id_admin);
    
    return successResponse(res, 200, 'Kategori destinasi berhasil diupdate', kategori);
  } catch (error) {
    next(error);
  }
};

const deleteKategori = async (req, res, next) => {
  try {
    const { id } = req.params;
    await kategoriDestinasiService.deleteKategori(id, req.user.id_admin);
    
    return successResponse(res, 200, 'Kategori destinasi berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori
};
