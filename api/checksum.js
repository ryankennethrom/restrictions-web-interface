import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const FOLDER_PATH = process.cwd(); // root of the project (entire restrictions-web-interface)

function hashFolder(folderPath) {
  const hash = crypto.createHash('sha256');

  function walkDir(dir) {
    const entries = fs.readdirSync(dir).sort();
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (stat.isFile()) {
        const fileBuffer = fs.readFileSync(fullPath);
        hash.update(fileBuffer);
      }
    }
  }

  walkDir(folderPath);
  return hash.digest('hex');
}

export default async function handler(req, res) {
  try {
    const folderHash = hashFolder(FOLDER_PATH);
    res.status(200).json({ folderHash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

