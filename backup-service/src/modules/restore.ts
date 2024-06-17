import { dbPayload } from "@/utils";
import { spawn } from "child_process";
 
// This is not necessary, but it's here just in case

// const restorePGBackup = async (backupFile: string) => {
//   const { host, user, database, password } = dbPayload();

//   const commandOptions = ["-h", host, "-U", user, "-d", database, "-f", backupFile];

//   const restoreProcess = spawn("pg_restore", commandOptions);

//   restoreProcess.stdout.on("data", (data) => {
//     console.log(`stdout: ${data}`);
//   });

//   restoreProcess.stdin.write(password + "\n");
//   restoreProcess.stdin.end();

//   restoreProcess.on("close", (code) => {
//     if (code === 0) {
//       console.log("Restore completed successfully");
//     } else {
//       console.error(`Restore failed with code ${code}`);
//     }
//   });
// };
