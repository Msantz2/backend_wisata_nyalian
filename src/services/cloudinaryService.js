const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (fileBuffer, fileName, folder = 'nyalian-desa-wisata') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: fileName,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto'
          }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(new Error(`Upload failed: ${error.message}`));
        }
        
        console.log('Image uploaded successfully:', result.public_id);
        
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          metadata: {
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
            created_at: result.created_at
          }
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const generateThumbnailUrl = (publicId) => {
  return cloudinary.url(publicId, {
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  });
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted successfully:', publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }
};

const uploadAndGetThumbnail = async (fileBuffer, fileName, folder = 'nyalian-desa-wisata') => {
  const uploadResult = await uploadImage(fileBuffer, fileName, folder);
  const thumbnailUrl = generateThumbnailUrl(uploadResult.public_id);

  return {
    url: uploadResult.url,
    thumbnail_url: thumbnailUrl,
    public_id: uploadResult.public_id,
    metadata: uploadResult.metadata
  };
};

module.exports = {
  uploadImage,
  uploadAndGetThumbnail,
  generateThumbnailUrl,
  deleteImage
};
