const adminService = require('../services/admin.service');
const { successResponse } = require('../utils/response');

const getAllAdmin = async (req, res, next) => {
  try {
    const filters = req.query;
    const result = await adminService.getAllAdmin(filters);
    
    return successResponse(res, 200, 'Data admin berhasil diambil', result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await adminService.getAdminById(id);
    
    return successResponse(res, 200, 'Detail admin berhasil diambil', admin);
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    
    return successResponse(res, 201, 'Admin berhasil ditambahkan', admin);
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await adminService.updateAdmin(id, req.body);
    
    return successResponse(res, 200, 'Admin berhasil diupdate', admin);
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    await adminService.deleteAdmin(id);
    
    return successResponse(res, 200, 'Admin berhasil dihapus', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
