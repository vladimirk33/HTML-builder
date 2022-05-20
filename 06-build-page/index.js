const path = require('path');
const fs = require('fs');
const fsPr = require('fs/promises');

function createFolder(pathFolder) {
  fs.access(pathFolder, (error) => {
    if (error) {
      fsPr.mkdir(pathFolder);
    }
  });
}

async function createFile(inputPath, content) {
  return await fsPr.writeFile(inputPath, content);
}

async function createHTML(fromPath, toPath, pathComponents) {

  let template = await fsPr.readFile(fromPath, 'utf-8');
  const filesNameArray = await fsPr.readdir(pathComponents, { withFileTypes: true });

  for (let item of filesNameArray) {
    const componentContent = await fsPr.readFile(path.join(pathComponents, item.name));
    const regExp = new RegExp(`{{${(item.name).split('.')[0]}}}`, 'g');
    template = template.replace(regExp, componentContent);
  }

  createFile(toPath, template);
}

async function createStyles(fromPath, toPath) {

  let stylesArray = [];
  const filesNameArray = await fsPr.readdir(fromPath, { withFileTypes: true });

  for (let item of filesNameArray) {

    const pathToCurr = path.join(fromPath, item.name);
    
    if (path.extname(pathToCurr) === '.css') {
      const text = await fsPr.readFile(pathToCurr);
      stylesArray.push(text);
    }
  }

  await fsPr.writeFile(toPath, stylesArray);
}

async function copyDirectory(fromPath, toPath) {

  await fsPr.rm(toPath, { force: true, recursive: true });
  await fsPr.mkdir(toPath, { recursive: true });

  const filesNameArray = await fsPr.readdir(fromPath, { withFileTypes: true });

  for (let item of filesNameArray) {
    const currentItemPath = path.join(fromPath, item.name);
    const copyItemPath = path.join(toPath, item.name);

    if (item.isFile()) {
      await fsPr.copyFile(currentItemPath, copyItemPath);
    } else if (item.isDirectory()) {
      await fsPr.mkdir(copyItemPath, { recursive: true });
      await copyDirectory(currentItemPath, copyItemPath);
    }
  }
}

function buildPage() {
  const pathFolder = path.join(__dirname, 'project-dist');
  createFolder(pathFolder);
  const pathComponents = path.join(__dirname, 'components');
  const pathOldHTML = path.join(__dirname, 'template.html');
  const pathNewHTML = path.join(pathFolder, 'index.html');
  createHTML(pathOldHTML, pathNewHTML, pathComponents);
  const pathOldStyles = path.join(__dirname, 'styles');
  const pathNewStyles = path.join(pathFolder, 'style.css');
  createStyles(pathOldStyles, pathNewStyles);
  const pathOldAssets = path.join(__dirname, 'assets');
  const pathNewAssets = path.join(pathFolder, 'assets');
  copyDirectory(pathOldAssets, pathNewAssets);
}

buildPage();