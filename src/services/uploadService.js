// src/services/uploadService.js

/**
 * Uploads an image file to Cloudinary.
 * Relies on frontend public environment variables.
 * 
 * @param {File} file - The image file to upload.
 * @returns {Promise<string>} The secure_url returned by Cloudinary.
 */
export async function uploadImage(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration is missing in environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
    }

    return data.secure_url;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred while uploading image', { cause: error });
  }
}
