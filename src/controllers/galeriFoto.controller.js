const galeriFotoService = require('../services/galeriFoto.service');
const { successResponse } = require('../utils/response');

const getAllGaleri = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await galeriFotoService.getAllGaleri(filters);
    
    return successResponse(res, 200, 'Data galeri foto berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getGaleriById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const galeri = await galeriFotoService.getGaleriById(id);
    
    return successResponse(res, 200, 'Detail galeri foto berhasil diambil', galeri);
  } catch (error) {
    next(error);
  }
};

const createGaleri = async (req, res, next) => {
  try {
    const fileBuffer = req.file ? req.file.buffer : null;
    const galeri = await galeriFotoService.createGaleri(req.body, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 201, 'Foto galeri berhasil ditambahkan', galeri);
  } catch (error) {
    next(error);
  }
};

const updateGaleri = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fileBuffer = req.file ? req.file.buffer : null;
    const galeri = await galeriFotoService.updateGaleri(id, req.body, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 200, 'Foto galeri berhasil diupdate', galeri);
  } catch (error) {
    next(error);
  }
};

const deleteGaleri = async (req, res, next) => {
  try {
    const { id } = req.params;
    await galeriFotoService.deleteGaleri(id, req.user.id_admin);
    
    return successResponse(res, 200, 'Foto galeri berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

const createBulkGaleri = async (req, res, next) => {
  try {
    const { id_destinasi } = req.body;
    const files = req.files || [];

    if (!files || files.length === 0) {
      const error = new Error('Minimal 1 foto harus diupload');
      error.statusCode = 400;
      throw error;
    }

    const filesWithMetadata = files.map((file, index) => ({
      buffer: file.buffer,
      caption: req.body[`caption_${index}`] || null,
      alt_text: req.body[`alt_text_${index}`] || null
    }));

    const result = await galeriFotoService.createBulkGaleri(
      id_destinasi,
      filesWithMetadata,
      req.user.id_admin
    );

    return successResponse(res, 201, result.meta.message, result.data, { total: result.meta.total });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
  createBulkGaleri
};
