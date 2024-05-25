import { v2 as cloudinary } from "cloudinary";

const isProduction = process.env.NODE_ENV === "production";

export const dbPayload = () => {
  const {
    DATABASE_USER: user,
    DATABASE_NAME: database,
    DATABASE_HOST: host,
    DATABASE_PASSWORD: password,
  } = process.env as Record<string, string>;

  if (isProduction) {
    return { host, user, database, password };
  }

  return {
    host: "db",
    user: "postgres",
    database: "postgres",
    password: "postgres",
  };
};

const { CLOUDINARY_URL, CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_NAME } =
  process.env as Record<string, string>;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
