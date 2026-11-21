import { Agent } from "node:https";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Allow slow DNS and TLS handshakes before the SDK's request timeout applies.
const cloudinaryUploadAgent = new Agent({ keepAlive: true, timeout: 60000 });

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1, // 1MB
  },
});

export const uploadImageFromBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "moji_chat/avatars",
        resource_type: "image",
        transformation: [{ width: 200, height: 200, crop: "fill" }],
        agent: cloudinaryUploadAgent,
        ...options,
      },

      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    uploadStream.end(buffer);
  });
};
