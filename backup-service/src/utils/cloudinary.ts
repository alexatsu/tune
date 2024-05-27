import type { ResourceApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

const { search } = cloudinary;

const getAllBackupsFromCloudinary = async (): Promise<ResourceApiResponse> => {
  return await search.expression(`folder:tune/db-backup`).execute();
};

export { getAllBackupsFromCloudinary };
