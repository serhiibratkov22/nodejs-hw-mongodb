// services/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { getEnvVar } from '../utils/getEnvVar.js';

cloudinary.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'contacts_photos' }, // опціонально можна задавати папку
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // посилання на фото
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
