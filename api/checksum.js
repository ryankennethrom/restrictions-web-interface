import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const FOLDER_PATH = process.cwd(); // root of project

function hashFolder(folderPath) {
  const hash = crypto.createHash('sha256');
  const EXCLUDE = ['node_modules', '.git'];

  const hashedItems = []; // store every file/folder hashed

  function walkDir(dir) {
    const entries = fs.readdirSync(dir).sort();

    for (const entry of entries) {
      if (entry.startsWith('.') || EXCLUDE.includes(entry)) continue;

      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        hashedItems.push(fullPath + '/'); // indicate directory
        walkDir(fullPath);
      } else if (stat.isFile()) {
        hashedItems.push(fullPath); // record file
        const fileBuffer = fs.readFileSync(fullPath);
        hash.update(fileBuffer);
      }
    }
  }

  walkDir(folderPath);
  return {
    hash: hash.digest('hex'),
    items: hashedItems,
  };
}

// Vercel handler
export default async function handler(req, res) {
  try {
    const { hash, items } = hashFolder(FOLDER_PATH);
    res.status(200).json({ folderHash: hash, hashedItems: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Running directly from Node CLI
  const folderHash = hashFolder(process.cwd());
  console.log(folderHash);
}
