const paketWisataService = require('../services/paketWisata.service');
const { successResponse } = require('../utils/response');

const getAllPaket = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await paketWisataService.getAllPaket(filters);
    
    return successResponse(res, 200, 'Data paket wisata berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getPaketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const paket = await paketWisataService.getPaketById(id);
    
    return successResponse(res, 200, 'Detail paket wisata berhasil diambil', paket);
  } catch (error) {
    next(error);
  }
};

const getPaketGaleri = async (req, res, next) => {
  try {
    const { id } = req.params;
    const galeri = await paketWisataService.getPaketGaleri(id);
    
    return successResponse(res, 200, 'Galeri paket wisata berhasil diambil', galeri);
  } catch (error) {
    next(error);
  }
};

const getPaketKuota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kuota = await paketWisataService.getPaketKuota(id, req.query);
    
    return successResponse(res, 200, 'Ketersediaan kuota berhasil diambil', kuota);
  } catch (error) {
    next(error);
  }
};

const createPaket = async (req, res, next) => {
  try {
    const fileBuffer = req.file ? req.file.buffer : null;
    const paket = await paketWisataService.createPaket(req.body, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 201, 'Paket wisata berhasil ditambahkan', paket);
  } catch (error) {
    next(error);
  }
};

const updatePaket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fileBuffer = req.file ? req.file.buffer : null;
    const paket = await paketWisataService.updatePaket(id, req.body, req.user.id_admin, fileBuffer);
    
    return successResponse(res, 200, 'Paket wisata berhasil diupdate', paket);
  } catch (error) {
    next(error);
  }
};

const deletePaket = async (req, res, next) => {
  try {
    const { id } = req.params;
    await paketWisataService.deletePaket(id, req.user.id_admin);
    
    return successResponse(res, 200, 'Paket wisata berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPaket,
  getPaketById,
  getPaketGaleri,
  getPaketKuota,
  createPaket,
  updatePaket,
  deletePaket
};
