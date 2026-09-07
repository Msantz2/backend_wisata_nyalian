const { Admin } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const getAllAdmin = async (filters) => {
  const { page = 1, limit = 10, search, sort = 'id_admin', order = 'ASC' } = filters;
  
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    where[Op.or] = [
      { username: { [Op.iLike]: `%${search}%` } },
      { nama_lengkap: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { count, rows } = await Admin.findAndCountAll({
    where,
    attributes: { exclude: ['password_hash'] },
    limit: parseInt(limit),
    offset,
    order: [[sort, order.toUpperCase()]]
  });

  return {
    data: rows,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count
    }
  };
};

const getAdminById = async (id) => {
  const admin = await Admin.findByPk(id, {
    attributes: { exclude: ['password_hash'] }
  });
  
  if (!admin) {
    const error = new Error('Admin tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return admin;
};

const createAdmin = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const admin = await Admin.create({
    ...data,
    password_hash: hashedPassword
  });

  const adminData = admin.toJSON();
  delete adminData.password_hash;
  
  return adminData;
};

const updateAdmin = async (id, data) => {
  const admin = await Admin.findByPk(id);
  
  if (!admin) {
    const error = new Error('Admin tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  if (data.password) {
    data.password_hash = await bcrypt.hash(data.password, 10);
    delete data.password;
  }
  
  await admin.update(data);

  const adminData = admin.toJSON();
  delete adminData.password_hash;
  
  return adminData;
};

const deleteAdmin = async (id) => {
  const admin = await Admin.findByPk(id);
  
  if (!admin) {
    const error = new Error('Admin tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }
  
  await admin.destroy();
  return admin;
};

module.exports = {
  getAllAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
