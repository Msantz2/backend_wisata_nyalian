const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return errorResponse(res, 400, 'Validasi database gagal', errors);
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: `${e.path} sudah digunakan`
    }));
    return errorResponse(res, 409, 'Data sudah ada', errors);
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse(res, 400, 'Relasi data tidak valid');
  }

  if (err.name === 'SequelizeDatabaseError') {
    return errorResponse(res, 500, 'Terjadi kesalahan database');
  }

  if (err.statusCode) {
    return errorResponse(res, err.statusCode, err.message);
  }

  return errorResponse(res, 500, 'Terjadi kesalahan server');
};

module.exports = errorHandler;
