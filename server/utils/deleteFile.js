import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const unlinkAsync = promisify(fs.unlink);

const deleteFile = async (dirpath, file) => {
  await unlinkAsync(
    path.join(__dirname, "../../public/uploads/", dirpath) + file
  );
};

export default deleteFile;
