import { getAllBackupsFromCloudinary } from "@/utils";
import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";
import cron from "node-cron";
import fs from "fs";

type ProcessedCharts = {
  [key: string]: Chart[];
};

type Chart = {
  title: string;
  urlId: string;
  url: string;
  duration: string;
  cover: string;
  view_count: number;
};

const { uploader } = cloudinary;
const cloudinaryFolder = "tune/charts-backup";
const tempFolder = "./src/temp";

const getProcessedChartsFromParser = async () => {
  console.log("Fetching new charts from parser...");
  const prodContainer = process.env.CHARTS_SERVICE_CONTAINER;
  const localContainer = "http://parser-service:8020";
  const isProduction = process.env.NODE_ENV === "production";
  const container = isProduction ? prodContainer : localContainer;
  const url = container + "/charts/send-charts-to-backup";
  const response = await fetch(url);
  const data = (await response.json()) as ProcessedCharts;

  const saveTempFileToJson = async () => {
    fs.writeFile(tempFolder + "/charts.json", JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log("File saved successfully");
      }
    });
  };

  await saveTempFileToJson();

  return data;
};

const getPreviousChartsFromCloudinary = async () => {
  console.log("Fetching previous charts from Cloudinary...");
  const { resources } = await getAllBackupsFromCloudinary(cloudinaryFolder);
  return resources;
};

const deletePreviousChartsFromCloudinary = async () => {
  console.log("Deleting previous charts from Cloudinary...");
  const resources = await getPreviousChartsFromCloudinary();
  if (resources.length) {
    await uploader.destroy(resources[0].public_id, { type: "upload", resource_type: "raw" });
  }
};

const uploadLatestChartsToCloudinary = async () => {
  console.log("Uploading latest charts to Cloudinary...");
  const options: UploadApiOptions = {
    resource_type: "raw",
    type: "upload",
    folder: cloudinaryFolder,
    use_filename: true,
  };

  const upload = await uploader.upload(tempFolder + "/charts.json", options);

  const data = upload.url;
  const date = new Date();
  const today = `snapshot-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  console.log(data, today);
};

const deleteTempFile = async () => {
  console.log("Deleting temp file...");
  fs.unlinkSync(tempFolder + "/charts.json");
};

const schedule = async () => {
  await getProcessedChartsFromParser();
  await deletePreviousChartsFromCloudinary();
  await uploadLatestChartsToCloudinary();
  await deleteTempFile();
};

schedule();

cron.schedule("0 0 * * 0", schedule);
