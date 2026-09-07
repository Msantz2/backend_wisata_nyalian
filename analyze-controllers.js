// API Audit Script - Extract actual responses from controllers
const fs = require('fs');
const path = require('path');

const controllersPath = 'C:/Wisata Desa Nyalian/backend_desa_nyalian/src/controllers';
const files = fs.readdirSync(controllersPath);

files.forEach(file => {
  if (file.endsWith('.controller.js')) {
    const filePath = path.join(controllersPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n====== ${file} ======`);
    console.log(content.substring(0, 500));
  }
});
