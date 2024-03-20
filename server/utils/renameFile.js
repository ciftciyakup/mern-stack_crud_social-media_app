import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const renameAsync = promisify(fs.rename);

const renameFile = async (dirpath, file, newName) => {
  await renameAsync(
    path.join(__dirname, "../../public/uploads/", dirpath) + file,
    path.join(__dirname, "../../public/uploads/", dirpath) + newName
  );
};

export default renameFile;
