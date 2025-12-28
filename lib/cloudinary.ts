import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File, folder: string = "cietv-news"): Promise<{ url: string; public_id: string } | null> {
  if (!file || file.size === 0) return null;

  // Convert File ke Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload menggunakan Promise (karena sdk cloudinary pakai callback style)
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder, 
        resource_type: "auto", 
        transformation: [
            { quality: "auto", fetch_format: "auto" }
        ]
      },
      (error, result) => {
        if (error) {
          // console.error("Cloudinary Upload Error:", error);
          reject(error);
          return;
        }
        
        if (result) {
            resolve({
                url: result.secure_url, 
                public_id: result.public_id
            });
        }
      }
    ).end(buffer); 
  });
}