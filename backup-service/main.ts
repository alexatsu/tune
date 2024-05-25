import cron from "node-cron";
import { spawn } from "child_process";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import type { ResourceApiResponse, UploadApiOptions } from "cloudinary";
import { dbPayload, formatDate } from "./utils";

dotenv.config();

const { search, uploader } = cloudinary;

const takePGBackup = async () => {
  const { host, user, database, password } = dbPayload();

  const backupVersion = `${formatDate()}`;

  const commandOptions = [
    "-h",
    host,
    "-U",
    user,
    "-d",
    database,
    "-f",
    `./db_backup_${backupVersion}.sql`,
  ];

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
};

const deleteOldestBackupFromCloudinary = async () => {
  try {
    const result: ResourceApiResponse = await search.expression(`folder:tune/db-backup`).execute();

    const sortByDate = result.resources.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    await uploader.destroy(sortByDate[0].public_id, {
      type: "upload",
      resource_type: "raw",
    });

    console.log("Deleted oldest backup from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};

const updloadBackupToCloudinary = async () => {
  const options: UploadApiOptions = {
    resource_type: "raw",
    type: "upload",
    folder: "tune/db-backup",
    use_filename: true,
  };

  const upload = await uploader.upload(`./db_backup_${formatDate()}.sql`, options);

  const data = upload.url;
  console.log(data);
};

const checkIfBackupsInCloudinaryMoreThanTwo = async () => {
  const result: ResourceApiResponse = await search.expression(`folder:tune/db-backup`).execute();

  if (result.resources.length > 2) {
    await deleteOldestBackupFromCloudinary();
  }
  await updloadBackupToCloudinary();
};

const schedule = async () => {
  await takePGBackup();
  await checkIfBackupsInCloudinaryMoreThanTwo();
};

schedule();

// cron.schedule("0 0 * * *", schedule);

//DONE
//i need to check if there any backup files in the backup folder in cloudinary
//if thre is more than 3 versions delete the oldest one
//then upload the backup file to cloudinary
//schedule cron job to run every day

//TODO
//add removing local backup after finishing pushing backup to cloudinary
//add postgres restore script
//tests
//add monitoring for backup with cloudwatch/prometheus
//notify on email if backup fails
//add separate ci pipeline for backup
