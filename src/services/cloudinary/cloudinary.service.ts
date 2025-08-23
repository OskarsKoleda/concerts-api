import { cloud } from "../../startup/cloudinary";
import { AppError } from "../../utils/AppError";

export const uploadImage = async (
  file?: Express.Multer.File
): Promise<{
  public_id: string | undefined;
  secure_url: string | undefined;
}> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve({ public_id: undefined, secure_url: undefined });
    }

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

export const destroyImage = async (public_id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    cloud.uploader.destroy(public_id, (error, result) => {
      if (error) {
        return reject(
          new AppError("Could not destroy the image: " + error.message, 500)
        );
      }

      if (result) {
        return resolve(true);
      }

      reject(new AppError("Unknown error during image destroy", 500));
    });
  });
};
