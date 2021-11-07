// Функция copyDir, которая копирует содержимое папки files в папку files-copy.

// 1. Импорт всех требуемых модулей
// 2. Создание папки files-copy в случае если она ещё не существует
// 3. Чтение содержимого папки files
// 4. Копирование файлов из папки files в папку files-copy

const fs = require('fs');
const path = require('path');

// __dirname возвращает путь к папке, в которой находится текущий файл
const directoryFromPath = path.join(__dirname, '/files');

const directoryТоPath = path.join(__dirname, '/files-copy');

// проверяем, существует ли папка files-copy
fs.stat(directoryТоPath, function (err) {
  // у кода ниже проблема - при удалении файла из папки files, она не удаляется из папки files-copy после запуска команды ``` node 04-copy-directory ```
  //   if (!err) {
  //     //  console.log('Директория есть');
  //   } else if (err.code === 'ENOENT') {
  //     //  console.log('директории нет');
  //     fs.mkdir(directoryТоPath, { recursive: true }, (err) => {
  //       if (err) throw err; // не удалось создать папки
  //       console.log('Папка успешно создана');
  //     });
  //   }
  if (!err) {
    //  если такая папка есть, то удаляем все файлы внутри этой папки
    fs.readdir(directoryТоPath, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directoryТоPath, file), (err) => {
          if (err) throw err;
        });
      }
    });
  } else if (err.code === 'ENOENT') {
    //  console.log('директории нет');
    fs.mkdir(directoryТоPath, { recursive: true }, (err) => {
      if (err) throw err; // не удалось создать папку
      console.log('Папка успешно создана');
    });
  }

  copyDir(directoryFromPath, directoryТоPath);
});

const copyDir = (pathDirectoryFrom, pathDirectoryTo) => {
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
        const filePathTo = path.join(pathDirectoryTo, fileNameWithExtention);
        if (file.isFile()) {
          fs.createReadStream(filePathFrom).pipe(
            fs.createWriteStream(filePathTo),
          );
        }
      });
    }
  });
};
