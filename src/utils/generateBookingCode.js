const generateBookingCode = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `BOOK-${year}${month}${day}-${randomPart}`;
};

module.exports = generateBookingCode;
