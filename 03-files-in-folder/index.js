// скрипт выводящий в консоль данные о файлах содержащихся в папке secret-folder.

// 1. Импорт всех требуемых модулей
// 2. Чтение содержимого папки secret-folder
// 3. Получение данных о каждом объекте который содержит папка secret-folder
// 4. Проверка объекта на то, что он является файлом
// 5. Вывод данных о файле в консоль

const fs = require('fs');
// const readdir = require('fs/promises');
const path = require('path');

// __dirname возвращает путь к папке, в которой находится текущий файл
const secretDirectoryPath = path.join(__dirname, '/secret-folder');

const printInfoAboutFiles = (pathToDirectory) => {
  fs.readdir(pathToDirectory, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        const fileNameWithExtention = file.name;
        const filePath = path.join(pathToDirectory, fileNameWithExtention);
        if (file.isFile()) {
          const fileExtention = path.extname(filePath).split('.')[1];
          const fileName = fileNameWithExtention.split('.')[0];
          fs.stat(filePath, (err, stats) => {
            console.log(
              `${fileName} - ${fileExtention} - ${stats.size / 1000}kb`,
            );
          });
        }
      });
    }
  });
};

printInfoAboutFiles(secretDirectoryPath);
