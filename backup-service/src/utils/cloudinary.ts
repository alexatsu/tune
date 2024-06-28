import type { ResourceApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

const { search } = cloudinary;

const getAllBackupsFromCloudinary = async (folder: string): Promise<ResourceApiResponse> => {
  return await search.expression("folder:" + folder).execute();
};

export { getAllBackupsFromCloudinary };
