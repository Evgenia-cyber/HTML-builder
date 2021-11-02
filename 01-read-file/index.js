// Чтение файла с выводом содержимого в консоль

// 1. Импортировать необходимые для выполнения задания модули
// 2. Создать новый ReadStream из файла text.txt.
// 3. Направить поток чтения в стандартный поток вывода(console.log() или process.stdout)

const path = require('path');
const fs = require('fs');

// __dirname возвращает путь к папке, в которой находится текущий файл
const textFilePath = path.join(__dirname, '/text.txt');

// создаем Readable поток (это потоки, из которых можно читать данные (например, fs.createReadStream()).)
const readStream = fs.createReadStream(textFilePath);

// Readableпотоки используют EventEmitterAPI для уведомления кода приложения, когда данные доступны для чтения из потока (событие 'data').
// когда произойдет событие 'data'
readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});
