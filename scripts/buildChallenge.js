const fs = require("fs-extra");
const path = require("node:path");
const util = require("node:util");
const cheerio = require("cheerio");
const { minify } = require("html-minifier-terser");
const postcss = require("postcss");
const postcssConfig = require("./postcss.config.js");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const inputDir = "../challenges";
const outputDir = "../web/public/challenges";

// search all index.html

async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory() && file === "global-stylesreset.css") continue;

    if (stat.isDirectory()) {
      await getAllFiles(filePath, fileList);
    } else if (file === "index.html") {
      fileList.push(filePath);
    }
  }

  return fileList;
}

// read css file and replace @import with content

async function readCssFile(filePath) {
  let data = await readFile(filePath, "utf8");
  const importRegex = /@import\s+url\(['"]([^'"]+)['"]\);/g;
  let match;
  while ((match = importRegex.exec(data)) !== null) {
    const importPath = path.resolve(path.dirname(filePath), match[1]);
    const importContent = await readCssFile(importPath);
    data = data.replace(match[0], importContent);
  }

  const processedCss = await postcss(postcssConfig.plugins).process(data, {
    from: undefined,
  });
  return processedCss.css;
}

// read js file and replace import with content

async function readJsFile(filePath) {
  let data = await readFile(filePath, "utf8");
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"];/g;
  let match;
  while ((match = importRegex.exec(data)) !== null) {
    const importPath = path.resolve(path.dirname(filePath), match[1]);
    const importContent = await readJsFile(importPath);
    data = data.replace(match[0], importContent);
  }
  return data;
}

// inline css and js in html file

async function inlineAssets(htmlPath) {
  const htmlContent = await readFile(htmlPath, "utf8");
  const $ = cheerio.load(htmlContent);

  // Inline CSS
  const linkTags = $('link[rel="stylesheet"]');
  for (let i = 0; i < linkTags.length; i++) {
    const linkTag = linkTags[i];
    const href = $(linkTag).attr("href");
    const cssPath = path.resolve(path.dirname(htmlPath), href);
    const cssContent = await readCssFile(cssPath);
    const styleTag = `<style>${cssContent}</style>`;
    $(linkTag).replaceWith(styleTag);
  }

  // Inline JS
  const scriptTags = $("script[src]");
  for (let i = 0; i < scriptTags.length; i++) {
    const scriptTag = scriptTags[i];
    const src = $(scriptTag).attr("src");
    const jsPath = path.resolve(path.dirname(htmlPath), src);
    const jsContent = await readJsFile(jsPath);
    const inlineScriptTag = `<script type="module">${jsContent}</script>`;
    $(scriptTag).replaceWith(inlineScriptTag);
  }

  return $.html();
}

// minify html

async function minifyHtml(htmlContent) {
  return await minify(htmlContent, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true,
    minifyCSS: true,
  });
}

// copy static files

async function copyStaticFiles(srcDir, destDir) {
  const entries = await readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      await fs.promises.mkdir(destPath, { recursive: true });
      await copyStaticFiles(srcPath, destPath);
    } else if (
      entry.name === "screenshot.webp" ||
      entry.name === "data.json" ||
      srcDir.includes("assets")
    ) {
      await fs.promises.mkdir(destDir, { recursive: true });
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

// process html files, copy static files, create challenge folders and remove empty directories

async function processHtmlFiles() {
  try {
    const htmlFiles = await getAllFiles(inputDir);
    for (const htmlFile of htmlFiles) {
      const inlinedHtml = await inlineAssets(htmlFile);
      const minifiedHtml = await minifyHtml(inlinedHtml);
      const outputFilePath = path.join(
        outputDir,
        path.relative(inputDir, htmlFile)
      );
      const outputFileDir = path.dirname(outputFilePath);
      await fs.promises.mkdir(outputFileDir, { recursive: true });
      await writeFile(outputFilePath, minifiedHtml, "utf8");
      console.log(`Processed and saved: ${outputFilePath}`);

      // Copy static files
      const srcDir = path.dirname(htmlFile);
      await copyStaticFiles(srcDir, outputFileDir);

      // remove directory if empty
      const designDir = path.join(outputFileDir, "design");
      const styleDir = path.join(outputFileDir, "style");
      const vscodeDir = path.join(outputFileDir, ".vscode");

      if (await fs.pathExists(designDir)) {
        await fs.remove(designDir);
      }

      if (await fs.pathExists(styleDir)) {
        await fs.remove(styleDir);
      }

      if (await fs.pathExists(vscodeDir)) {
        await fs.remove(vscodeDir);
      }
    }
  } catch (err) {
    console.error("Error processing HTML files:", err);
  }
}

module.exports = processHtmlFiles;
