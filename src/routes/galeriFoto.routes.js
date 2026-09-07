const express = require('express');
const router = express.Router();
const galeriFotoController = require('../controllers/galeriFoto.controller');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { upload, handleMulterError } = require('../middlewares/multerSetup');
const Joi = require('joi');

const createGaleriSchema = Joi.object({
  id_destinasi: Joi.number().integer().required(),
  alt_text: Joi.string().max(200).allow('', null).optional(),
  caption: Joi.string().allow('', null).optional(),
  urutan: Joi.number().integer().min(0).default(0).optional()
});

const updateGaleriSchema = Joi.object({
  id_destinasi: Joi.number().integer().optional(),
  alt_text: Joi.string().max(200).allow('', null).optional(),
  caption: Joi.string().allow('', null).optional(),
  urutan: Joi.number().integer().min(0).optional()
});

const createBulkGaleriSchema = Joi.object({
  id_destinasi: Joi.number().integer().required()
});

router.get('/', galeriFotoController.getAllGaleri);
router.get('/:id', galeriFotoController.getGaleriById);
router.post('/', verifyToken, requireAdmin, upload.single('foto'), handleMulterError, validate(createGaleriSchema), galeriFotoController.createGaleri);
router.post('/bulk', verifyToken, requireAdmin, upload.array('fotos', 50), handleMulterError, validate(createBulkGaleriSchema), galeriFotoController.createBulkGaleri);
router.put('/:id', verifyToken, requireAdmin, upload.single('foto'), handleMulterError, validate(updateGaleriSchema), galeriFotoController.updateGaleri);
router.delete('/:id', verifyToken, requireAdmin, galeriFotoController.deleteGaleri);

module.exports = router;
