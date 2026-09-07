const ketersediaanKuotaService = require('../services/ketersediaanKuota.service');
const { successResponse } = require('../utils/response');

const getAllKuota = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await ketersediaanKuotaService.getAllKuota(filters);
    
    return successResponse(res, 200, 'Data ketersediaan kuota berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getKuotaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kuota = await ketersediaanKuotaService.getKuotaById(id);
    
    return successResponse(res, 200, 'Detail ketersediaan kuota berhasil diambil', kuota);
  } catch (error) {
    next(error);
  }
};

const createKuota = async (req, res, next) => {
  try {
    const kuota = await ketersediaanKuotaService.createKuota(req.body);
    
    return successResponse(res, 201, 'Ketersediaan kuota berhasil ditambahkan', kuota);
  } catch (error) {
    next(error);
  }
};

const updateKuota = async (req, res, next) => {
  try {
    const { id } = req.params;
    const kuota = await ketersediaanKuotaService.updateKuota(id, req.body);
    
    return successResponse(res, 200, 'Ketersediaan kuota berhasil diupdate', kuota);
  } catch (error) {
    next(error);
  }
};

const deleteKuota = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ketersediaanKuotaService.deleteKuota(id);
    
    return successResponse(res, 200, 'Ketersediaan kuota berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllKuota,
  getKuotaById,
  createKuota,
  updateKuota,
  deleteKuota
};
