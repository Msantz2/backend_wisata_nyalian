const destinasiService = require('../services/destinasi.service');
const { successResponse } = require('../utils/response');

const getAllDestinasi = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await destinasiService.getAllDestinasi(filters);
    
    return successResponse(res, 200, 'Data destinasi berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getDestinasiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const destinasi = await destinasiService.getDestinasiById(id);
    
    return successResponse(res, 200, 'Detail destinasi berhasil diambil', destinasi);
  } catch (error) {
    next(error);
  }
};

const getDestinasiBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const destinasi = await destinasiService.getDestinasiBySlug(slug);
    
    return successResponse(res, 200, 'Detail destinasi berhasil diambil', destinasi);
  } catch (error) {
    next(error);
  }
};

const getDestinasiGaleri = async (req, res, next) => {
  try {
    const { id } = req.params;
    const galeri = await destinasiService.getDestinasiGaleri(id);
    
    return successResponse(res, 200, 'Galeri destinasi berhasil diambil', galeri);
  } catch (error) {
    next(error);
  }
};

const createDestinasi = async (req, res, next) => {
  try {
    const fileBuffer = req.file ? req.file.buffer : null;
    const destinasi = await destinasiService.createDestinasi(req.body, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 201, 'Destinasi berhasil ditambahkan', destinasi);
  } catch (error) {
    next(error);
  }
};

const updateDestinasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fileBuffer = req.file ? req.file.buffer : null;
    const destinasi = await destinasiService.updateDestinasi(id, req.body, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 200, 'Destinasi berhasil diupdate', destinasi);
  } catch (error) {
    next(error);
  }
};

const deleteDestinasi = async (req, res, next) => {
  try {
    const { id } = req.params;
    await destinasiService.deleteDestinasi(id, req.user.id_admin);
    
    return successResponse(res, 200, 'Destinasi berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDestinasi,
  getDestinasiById,
  getDestinasiBySlug,
  getDestinasiGaleri,
  createDestinasi,
  updateDestinasi,
  deleteDestinasi
};
