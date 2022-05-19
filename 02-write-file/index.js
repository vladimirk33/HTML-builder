const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

rl.write('Введите текст:\n');

rl.on('line', (text) => {
  if (text === 'exit') {
    rl.close();
  }

  writeableStream.write(text, error => {
    if (error) throw error;
  });
});

rl.on('close', () => {
  process.exit();
});

process.on('exit', code => {
  if (code === 0) console.log('До свидания!');
});