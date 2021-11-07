// скрипт собирающий в единый файл содержимое папки **styles**. Выходной файл должен носить имя **bundle.css** и находиться внутри папки **project-dist**.

// 1. Импорт всех требуемых модулей
// 2. Чтение содержимого папки **styles**
// 3. Проверка является ли объект файлом и имеет ли файл нужное расширение
// 4. Чтение файла стилей
// 5. Запись прочитанных данных в массив
// 6. Запись массива стилей в файл **bundle.css**

const fs = require('fs');
const path = require('path');

// __dirname возвращает путь к папке, в которой находится текущий файл
const directoryFromPath = path.join(__dirname, '/styles');

const directoryТоPath = path.join(__dirname, '/project-dist');

const fileToPath = path.join(directoryТоPath, '/bundle.css');

// fs.stat(fileToPath, function (err, stats) {
fs.stat(fileToPath, function (err) {
  if (err) {
    //  console.log('Файл не найден', stats);
  } else {
    //  console.log('Файл найден', stats);
    // удаляем файл bundle, если он есть
    fs.unlink(path.join(directoryТоPath, 'bundle.css'), (err) => {
      if (err) throw err;
    });
  }

  copyStyles(directoryFromPath, fileToPath);
});

const copyStyles = (pathDirectoryFrom, filePathTo) => {
  // После прочтения содержимого папки, в случае если вы установите опцию ```{withFileTypes: true}```, каждый объект содержащийся в ней будет представлен в виде инстанса класса [Dirent](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fs_class_fs_dirent). Его методы позволят вам узнать, является ли объект файлом.
  fs.readdir(pathDirectoryFrom, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        const fileNameWithExtention = file.name;
        const filePathFrom = path.join(
          pathDirectoryFrom,
          fileNameWithExtention,
        );
        const fileExtention = path.extname(fileNameWithExtention);
        if (file.isFile() && fileExtention === '.css') {
          // console.log(pathDirectoryFrom, fileNameWithExtention);
          fs.createReadStream(filePathFrom).pipe(
            fs.createWriteStream(filePathTo, { flags: 'a' }),
          ); // чтобы дописывалось, а не перезаписывалось, добавляем флаг
        }
      });
    }
  });
};

module.exports = {
  copyStyles,
};
