const path = require('path');
const fsPr = require('fs/promises');

const pathTo = path.join(__dirname, 'project-dist', 'bundle.css');
const pathFrom = path.join(__dirname, 'styles');

let stylesArray = [];

(async () => {

  const filesNameArray = await fsPr.readdir(pathFrom, { withFileTypes: true });

  for (let item of filesNameArray) {

    const pathToCurr = path.join(pathFrom, item.name);
    
    if (path.extname(pathToCurr) === '.css') {
      const text = await fsPr.readFile(pathToCurr);
      stylesArray.push(text);
    }
  }

  await fsPr.writeFile(pathTo, stylesArray);
})();