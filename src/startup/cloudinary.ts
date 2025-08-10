import cloudinary from "cloudinary";

const cloud = cloudinary.v2;

const setCloudinary = () => {
  cloud.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export { cloud, setCloudinary };


