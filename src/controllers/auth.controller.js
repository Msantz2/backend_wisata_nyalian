const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    console.log('[AUTH] Login attempt for username:', username);
    
    const result = await authService.login(username, password);
    
    console.log('[AUTH] Token generated successfully for:', username);
    console.log('[AUTH] Token prefix:', result.token.substring(0, 50) + '...');
    
    console.log('[AUTH] Setting auth_token cookie...');
    
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });
    
    console.log('[AUTH] ✅ auth_token cookie set successfully');
    
    return successResponse(res, 200, 'Login berhasil', result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    console.log('[AUTH] Logout for user:', req.user.username);
    
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      path: '/'
    });
    
    console.log('[AUTH] ✅ auth_token cookie cleared successfully');
    
    return successResponse(res, 200, 'Logout berhasil', null);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const admin = await authService.getProfile(req.user.id_admin);
    
    return successResponse(res, 200, 'Profil admin berhasil diambil', admin);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;
    await authService.changePassword(req.user.id_admin, old_password, new_password);
    
    return successResponse(res, 200, 'Password berhasil diubah', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getProfile,
  changePassword
};
