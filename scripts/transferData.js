const fs = require("node:fs");
const path = require("node:path");
const util = require("node:util");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const inputDir = "../challenges";
const outputFile = "../web/src/conts/CHALLENGES.ts";

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      await getAllFiles(filePath, fileList);
    } else if (file === "challenge.json") {
      fileList.push(filePath);
    }
  }

  return fileList;
}

async function readJsonFile(filePath) {
  const data = await readFile(filePath, "utf8");
  return JSON.parse(data);
}

async function writeTsFile(data, outputPath) {
  const content = `import type { Challenge } from "@/types/challenge"\n export const CHALLENGES: Challenge[] = ${JSON.stringify(
    data,
    null,
    2
  )};\n`;
  await writeFile(outputPath, content, "utf8");
}

async function unifyJsonFiles() {
  try {
    const files = await getAllFiles(inputDir);
    const jsonObjects = await Promise.all(
      files.map((file) => readJsonFile(file))
    );

    // Get the newest file based on its creation time
    const fileStats = await Promise.all(
      files.map((file) => fs.promises.stat(file))
    );
    const newestFileIndex = fileStats.findIndex(
      (stat) =>
        stat.mtime.getTime() ===
        Math.max(...fileStats.map((stat) => stat.mtime.getTime()))
    );

    // Add isNew: true to the newest JSON object and remove isNew from others
    jsonObjects.forEach((obj, index) => {
      if (index === newestFileIndex) {
        obj.isNew = true;
      } else {
        delete obj.isNew;
      }
    });

    await writeTsFile(jsonObjects, outputFile);
    console.log("JSON files unified and written to CHALLENGES.ts");
  } catch (err) {
    console.error("Error unifying JSON files:", err);
  }
}

module.exports = unifyJsonFiles;
