import { v2 as cloudinary } from 'cloudinary';

let configured = false;

function ensureCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }
  return true;
}

export function isCloudinaryEnabled(): boolean {
  return ensureCloudinaryConfigured();
}

export async function uploadProductImageIfNeeded(
  image: string
): Promise<string> {
  if (!image || !image.startsWith('data:image/')) {
    return image;
  }

  if (!ensureCloudinaryConfigured()) {
    return image;
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'sinyora-gee/products',
      resource_type: 'image',
      transformation: [
        { width: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      ],
    });
    return result.secure_url || image;
  } catch (err) {
    console.error('Cloudinary upload failed, falling back to inline image:', err);
    return image;
  }
}

