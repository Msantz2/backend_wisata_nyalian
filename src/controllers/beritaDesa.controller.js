const beritaDesaService = require('../services/beritaDesa.service');
const { successResponse } = require('../utils/response');

const getAllBerita = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await beritaDesaService.getAllBerita(filters);
    
    return successResponse(res, 200, 'Data berita berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getBeritaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const berita = await beritaDesaService.getBeritaById(id);
    
    return successResponse(res, 200, 'Detail berita berhasil diambil', berita);
  } catch (error) {
    next(error);
  }
};

const createBerita = async (req, res, next) => {
  try {
    const fileBuffer = req.file ? req.file.buffer : null;
    const berita = await beritaDesaService.createBerita(req.body, req.user.id_admin, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 201, 'Berita berhasil dibuat', berita);
  } catch (error) {
    next(error);
  }
};

const updateBerita = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fileBuffer = req.file ? req.file.buffer : null;
    const berita = await beritaDesaService.updateBerita(id, req.body, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 200, 'Berita berhasil diupdate', berita);
  } catch (error) {
    next(error);
  }
};

const deleteBerita = async (req, res, next) => {
  try {
    const { id } = req.params;
    await beritaDesaService.deleteBerita(id, req.user.id_admin);
    
    return successResponse(res, 200, 'Berita berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita
};
