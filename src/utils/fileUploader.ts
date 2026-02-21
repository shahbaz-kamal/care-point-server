import multer from "multer";
import path from "path";

import { v2 as cloudinary } from "cloudinary";
import { envVars } from "../app/config/env";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
    api_key: envVars.CLOUDINARY.API_KEY,
    api_secret: envVars.CLOUDINARY.API_SECRET, // Click 'View API Keys' above to copy your API secret
  });
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.filename + new Date().toLocaleDateString(),
    })
    .catch((error) => {
      console.log(error);
    });

  // console.log(uploadResult);

  return uploadResult;
};

export const fileUploader = { upload, uploadToCloudinary };
