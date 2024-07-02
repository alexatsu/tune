import fs from "fs";
import { spawn } from "child_process";

import cron from "node-cron";
import { v2 as cloudinary } from "cloudinary";
import type { ResourceApiResponse, UploadApiOptions } from "cloudinary";

import { dbPayload, formatDate, getAllBackupsFromCloudinary } from "@/utils";

const { uploader } = cloudinary;

const takePGBackup = async () => {
  const backupVersion = `${formatDate()}-${process.env.NODE_ENV}`;
  const backupFile = `./db_backup_${backupVersion}.sql`;
  const { host, user, database, password } = dbPayload();

  const commandOptions = ["-h", host, "-U", user, "-d", database, "-f", backupFile];

  const backupProcess = spawn("pg_dump", commandOptions);

  backupProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  backupProcess.stdin.write(password + "\n");
  backupProcess.stdin.end();

  backupProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Backup completed successfully");
    } else {
      console.error(`Backup failed with code ${code}`);
    }
  });

  return backupFile;
};

const sortResourcesDescending = (resources: ResourceApiResponse["resources"]) => {
  return resources.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

const deleteOldestBackupFromCloudinary = async () => {
  try {
    const { resources } = await getAllBackupsFromCloudinary(`tune/db-backup`);

    const sortedBackups = sortResourcesDescending(resources) as ResourceApiResponse["resources"] &
      { public_id: string }[];
    const latestBackup = sortedBackups[2].public_id;
    await uploader.destroy(latestBackup, { type: "upload", resource_type: "raw" });

    console.log("Deleted oldest backup from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};

const uploadBackupToCloudinary = async (backupFile: string) => {
  const options: UploadApiOptions = {
    resource_type: "raw",
    type: "upload",
    folder: "tune/db-backup",
    use_filename: true,
  };

  const upload = await uploader.upload(backupFile, options);

  const data = upload.url;
  console.log(data);
};

const deleteLocalBackup = async () => {
  try {
    const files = await fs.promises.readdir("./");

    for (const file of files) {
      if (file.startsWith("db_backup_")) {
        await fs.promises.unlink(file);
        console.log(`Deleted ${file}`);
      }
    }
  } catch (err) {
    console.error("Error deleting local backup:", err);
  }
};

const schedule = async () => {
  const backupFile = await takePGBackup();
  const { resources } = await getAllBackupsFromCloudinary(`tune/db-backup`);

  if (resources.length > 2) {
    await deleteOldestBackupFromCloudinary();
  }

  await uploadBackupToCloudinary(backupFile);
  await deleteLocalBackup();

  console.log("Scheduled backup");
};

await schedule();

cron.schedule("0 0 * * *", schedule);
