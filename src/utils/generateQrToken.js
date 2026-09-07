const { v4: uuidv4 } = require('uuid');

const generateQrToken = () => {
  return uuidv4();
};

module.exports = generateQrToken;
