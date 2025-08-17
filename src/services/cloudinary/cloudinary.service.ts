import { cloud } from "../../startup/cloudinary";
import { AppError } from "../../utils/AppError";

export const uploadImage = async (
  file?: Express.Multer.File
): Promise<{
  public_id: string;
  secure_url: string;
}> => {
  if (!file) {
    throw new AppError("Event must include a poster image", 400);
  }

  return new Promise((resolve, reject) => {
    cloud.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) {
          return reject(
            new AppError("Could not upload the image: " + error.message, 500)
          );
        }

        if (result) {
          return resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        }
        reject(new AppError("Unknown error during image upload", 500));
      })
      .end(file.buffer);
  });
};

export const removeImage = () => {
  // ...
};
