// скрипт который:
// 1. Создаёт папку  **project-dist**.
// 2. Заменяет шаблонные теги в файле **template.html** с названиями файлов из папки components (пример:```{{section}}```) на содержимое одноимённых компонентов и  сохраняет результат в **project-dist/index.html**.
// 3. Собирает в единый файл стили из папки **styles** и помещает их в файл **project-dist/style.css**.
// 4. Копирует папку **assets** в **project-dist/assets**

// Один из возможных порядков выполнения задачи:
// 1. Импорт всех требуемых модулей
// 2. Прочтение и сохранение в переменной файла-шаблона
// 3. Нахождение всех имён тегов в файле шаблона
// 4. Замена шаблонных тегов содержимым файлов-компонентов
// 5. Запись изменённого шаблона в файл **index.html** в папке **project-dist**
// 6. Использовать скрипт написанный в задании **05-merge-styles** для создания файла **style.css**
// 7. Использовать скрипт из задания **04-copy-directory** для переноса папки **assets** в папку project-dist

const fs = require('fs');
const path = require('path');
// const readline = require('readline'); // readline Модуль обеспечивает интерфейс для считывания данных из Readable потока (например process.stdin) на одну строку за один раз.

const { copyStyles } = require('../05-merge-styles');

// __dirname возвращает путь к папке, в которой находится текущий файл
const directoryHTMLComponentsFromPath = path.join(__dirname, '/components');
const directoryStylesFromPath = path.join(__dirname, '/styles');
const directoryAssetsFromPath = path.join(__dirname, '/assets');

const fileHTMLFromPath = path.join(__dirname, '/template.html');

const directoryТоPath = path.join(__dirname, '/project-dist');
const directoryAssetsToPath = path.join(directoryТоPath, '/assets');

const fileHTMLToPath = path.join(directoryТоPath, '/index.html');
const fileStylesToPath = path.join(directoryТоPath, '/style.css');

const makeDirectory = (directoryPath) => {
  fs.mkdir(directoryPath, { recursive: true }, (err) => {
    if (err) throw err; // не удалось создать папку
    // console.log('Папка успешно создана', directoryPath);
  });
};

const removeDirectory = (directoryPath) => {
  fs.rm(directoryPath, { recursive: true, force: true }, (err) => {
    if (err) {
      // throw err; // не удалось удалить папку
      removeDirectory(directoryPath);
    }
    // console.log('Папка успешно удалена', directoryPath);
  });
  // deprecated fs.rmdir устарел в Node 16
  // fs.rmdir(directoryPath, { recursive: true }, (err) => {
  //   if (err) throw err; // не удалось удалить папку
  //   console.log('Папка успешно удалена', directoryPath);
  // });
};

const buildPage = (mainDirectoryToPath) => {
  // создаем папку project-dist
  makeDirectory(mainDirectoryToPath);
  // создаем папку assets
  makeDirectory(directoryAssetsToPath);
  // собираем html код по файлу template.html, используя файлы из папки components, в файл project-dist/index.html
  copyHTML(directoryHTMLComponentsFromPath, fileHTMLFromPath, fileHTMLToPath);
  // копируем файлы из папки assets в project-dist/assest
  copyDir(directoryAssetsFromPath, directoryAssetsToPath);
  // копируем стили из папки styles в один файл style.css
  copyStyles(directoryStylesFromPath, fileStylesToPath);
};

// не получилось остановить readline, чтобы поток приостанавливался, не считывал следующую линию и ждал,пока вместо тегов запишется код
// const copyHTML = (pathDirectoryFrom, pathTemplateFrom, pathFileTo) => {
//   const writeHTMLToFile = fs.createWriteStream(pathFileTo, { flags: 'a' }); // чтобы дописывалось, а не перезаписывалось

//   const rl = readline.createInterface({
//     input: fs.createReadStream(pathTemplateFrom),
//   });

//   rl.on('line', (line) => {
//     const templateTag = line.match(/\{{.*?\}}/);
//     if (templateTag) {
//       const componentFileName = templateTag.map((x) =>
//         x.replace(/[{{ }}]/g, ''),
//       )[0];
//       const componentFilePath = path.join(
//         pathDirectoryFrom,
//         `${componentFileName}.html`,
//       );
//       const readHTMLFrom = fs.createReadStream(componentFilePath);
//       // console.log(`Received: ${line}`, componentFilePath);
//       readHTMLFrom.pipe(writeHTMLToFile);
//     } else {
//       writeHTMLToFile.write(line + '\n');
//       // console.log(`Received: ${line}`, templateTag);
//     }
//   });

// };

const copyHTML = (pathDirectoryFrom, pathTemplateFrom, pathFileTo) => {
  const readStream = fs.createReadStream(pathTemplateFrom);

  // Readable потоки используют EventEmitterAPI для уведомления кода приложения, когда данные доступны для чтения из потока (событие 'data').
  // когда произойдет событие 'data'
  readStream.on('data', (chunk) => {
    // считываем содержимое файла template.html
    let htmlTemplate = chunk.toString();
    // находим все теги
    const templateTags = htmlTemplate.match(/\{{.*?\}}/g); // [{{header}}, {{articles}}, {{footer}}]
    // убираем {{ и }}
    const componentFilesNames = templateTags.map(
      (tag) => tag.replace(/[{{}}]/g, ''), // [header, articles, footer]
    );

    componentFilesNames.forEach((fileName, index) => {
      // получаем путь до файла-компонента
      const componentFilePath = path.join(
        pathDirectoryFrom,
        `${fileName}.html`,
      );

      // читаем содержимое файла-компонента
      fs.readFile(componentFilePath, 'utf8', function (error, fileContent) {
        if (error) throw error; // ecли ошибка чтения файла

        // заменяем теги на нужный код
        htmlTemplate = htmlTemplate.replace(templateTags[index], fileContent);

        // если это последний тег
        const isLastTag = templateTags.length - 1 === index;
        setTimeout(() => {
          if (isLastTag) {
            // записываем измененный код без тегов в project-dist/index.html
            fs.writeFile(pathFileTo, htmlTemplate, function (error) {
              if (error) throw error; // ecли ошибка записи файла
              console.log('Данные успешно записаны в файл');
            });
          }
        }, 500);
      });
    });
  });
};

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

        if (file.isDirectory()) {
          const newPathTo = path.join(pathDirectoryTo, fileNameWithExtention);
          makeDirectory(newPathTo);
          copyDir(filePathFrom, newPathTo);
        } else if (file.isFile()) {
          setTimeout(() => {
            const filePathTo = path.join(
              pathDirectoryTo,
              fileNameWithExtention,
            );
            fs.createReadStream(filePathFrom).pipe(
              fs.createWriteStream(filePathTo),
            );
          }, 500);
        }
      });
    }
  });
};

// проверяем, существует ли папка project-dist
fs.access(directoryТоPath, function (err) {
  if (!err) {
    //  если такая папка есть, то удаляем eё
    removeDirectory(directoryТоPath);
  }
  setTimeout(() => {
    buildPage(directoryТоPath);
  }, 500);
});
