const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (username, password) => {
  console.log('[AUTH LOGIN] ========== START ==========');
  console.log('[AUTH LOGIN] Username received:', username);
  console.log('[AUTH LOGIN] Password received:', password ? '***' : 'EMPTY');
  
  const admin = await Admin.findOne({ where: { username } });
  
  console.log('[AUTH LOGIN] Admin found:', admin ? 'YES' : 'NO');
  if (admin) {
    console.log('[AUTH LOGIN] Admin ID:', admin.id_admin);
    console.log('[AUTH LOGIN] Admin username:', admin.username);
    console.log('[AUTH LOGIN] Admin role:', admin.role);
    console.log('[AUTH LOGIN] Password hash exists:', admin.password_hash ? 'YES' : 'NO');
    if (admin.password_hash) {
      console.log('[AUTH LOGIN] Hash format:', admin.password_hash.substring(0, 10) + '...');
    }
  }
  
  if (!admin) {
    const error = new Error('Username atau password salah');
    error.statusCode = 401;
    console.log('[AUTH LOGIN] ❌ Admin not found');
    throw error;
  }

  console.log('[AUTH LOGIN] Comparing passwords...');
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
  
  console.log('[AUTH LOGIN] Password valid:', isPasswordValid ? 'YES' : 'NO');
  
  if (!isPasswordValid) {
    const error = new Error('Username atau password salah');
    error.statusCode = 401;
    console.log('[AUTH LOGIN] ❌ Password mismatch');
    throw error;
  }

  console.log('[AUTH LOGIN] ✅ Credentials valid, generating token...');
  const token = jwt.sign(
    {
      id_admin: admin.id_admin,
      username: admin.username,
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  console.log('[AUTH LOGIN] ✅ Token generated');
  
  const adminData = admin.toJSON();
  delete adminData.password_hash;

  console.log('[AUTH LOGIN] ========== END ==========');
  return {
    admin: adminData,
    token
  };
};

const getProfile = async (id_admin) => {
  const admin = await Admin.findByPk(id_admin, {
    attributes: { exclude: ['password_hash'] }
  });
  
  if (!admin) {
    const error = new Error('Admin tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  return admin;
};

const changePassword = async (id_admin, oldPassword, newPassword) => {
  const admin = await Admin.findByPk(id_admin);
  
  if (!admin) {
    const error = new Error('Admin tidak ditemukan');
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, admin.password_hash);
  
  if (!isPasswordValid) {
    const error = new Error('Password lama tidak sesuai');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await admin.update({ password_hash: hashedPassword });

  return true;
};

module.exports = {
  login,
  getProfile,
  changePassword
};
