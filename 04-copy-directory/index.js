const fs = require('fs');
const fsPr = require('fs/promises');
const path = require('path');

const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

fs.access(pathTo, (error) => {
  if (error) {
    fsPr.mkdir(pathTo);
  }
});

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

copyDirectory(pathFrom, pathTo);