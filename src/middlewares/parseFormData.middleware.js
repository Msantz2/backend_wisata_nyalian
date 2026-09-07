const parseFormDataArrays = (fields = []) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      fields.forEach(field => {
        if (req.body[field] && typeof req.body[field] === 'string') {
          try {
            const parsed = JSON.parse(req.body[field]);
            req.body[field] = parsed;
          } catch (error) {
            if (field === 'itinerary') {
              req.body[field] = req.body[field];
            } else {
              console.warn(`[parseFormData] Failed to parse ${field}:`, error.message);
            }
          }
        }
      });
    }
    next();
  };
};

const parseFormDataNumbers = (fields = []) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      fields.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
          const parsed = Number(req.body[field]);
          if (!isNaN(parsed)) {
            req.body[field] = parsed;
          }
        }
      });
    }
    next();
  };
};

const parseFormDataBooleans = (fields = []) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      fields.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== null) {
          if (req.body[field] === 'true' || req.body[field] === true) {
            req.body[field] = true;
          } else if (req.body[field] === 'false' || req.body[field] === false) {
            req.body[field] = false;
          }
        }
      });
    }
    next();
  };
};

module.exports = {
  parseFormDataArrays,
  parseFormDataNumbers,
  parseFormDataBooleans
};
