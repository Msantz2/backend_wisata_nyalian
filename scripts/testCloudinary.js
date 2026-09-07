#!/usr/bin/env node

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const testConnection = async () => {
  try {
    console.log('Testing Cloudinary connection...');
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: process.env.CLOUDINARY_UPLOAD_FOLDER,
      max_results: 1
    });
    
    console.log('✅ Cloudinary connection successful!');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`Upload Folder: ${process.env.CLOUDINARY_UPLOAD_FOLDER}`);
    console.log(`Resources in folder: ${result.resources.length}`);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed!');
    console.error('Error:', error.message);
    console.error('\nPlease verify:');
    console.error('1. CLOUDINARY_CLOUD_NAME is set in .env');
    console.error('2. CLOUDINARY_API_KEY is set in .env');
    console.error('3. CLOUDINARY_API_SECRET is set in .env');
    console.error('4. Credentials are correct from https://cloudinary.com/console');
    return false;
  }
};

const testUpload = async () => {
  try {
    console.log('\nTesting image upload...');
    
    const buffer = Buffer.from('fake image data for testing');
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER,
          public_id: 'test-connection-' + Date.now(),
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('❌ Upload test failed!');
            console.error('Error:', error.message);
            reject(error);
          } else {
            console.log('✅ Upload test successful!');
            console.log(`Test image uploaded: ${result.public_id}`);
            console.log(`URL: ${result.secure_url}`);
            
            cloudinary.uploader.destroy(result.public_id, (err) => {
              if (!err) {
                console.log('✅ Test image cleaned up');
              }
            });
            
            resolve(true);
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('❌ Upload test error:', error.message);
    return false;
  }
};

const runTests = async () => {
  console.log('🔍 Cloudinary Integration Tests\n');
  console.log('=' .repeat(50));
  
  const connectionOk = await testConnection();
  
  if (connectionOk) {
    await testUpload();
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('Tests completed!');
};

runTests().catch(console.error);
