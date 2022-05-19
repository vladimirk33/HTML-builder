const fs = require('fs/promises');
const path = require('path');

(async() => {
  const files = await fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(__dirname, 'secret-folder', file.name);
    const ext = path.extname(filePath);
    const fileStats = await fs.stat(filePath);
    if (fileStats.isFile()) console.log(`${file.name.split('.')[0]} - ${ext.substring(1,)} - ${fileStats.size}b`);
  }
})();