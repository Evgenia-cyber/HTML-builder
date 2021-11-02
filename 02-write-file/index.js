// Cкрипт выводящий в консоль приветствие, ожидающий ввод текста, и записывающий введённый текст в файл.

// 1. Импорт всех требуемых модулей.
// 2. Создание потока записи в текстовый файл
// 3. Вывод в консоль приветственного сообщения
// 4. Ожидание ввода текста пользователем, с дальнейшей проверкой ввода на наличие ключевого слова exit
// 5. Запись текста в файл
// 6. Ожидание дальнейшего ввода
// 7. Реализация прощального сообщения при остановке процесса

const process = require('process'); // Хотя process доступен как глобальный, рекомендуется явно получить к нему доступ через require или import

const fs = require('fs');
const path = require('path');
const readline = require('readline'); // readlineМодуль обеспечивает интерфейс для считывания данных из Readable потока (например process.stdin) на одну строку за один раз.

console.log('Hello. Enter text.');

const readTextFromConsole = process.stdin;

// __dirname возвращает путь к папке, в которой находится текущий файл
const textFilePath = path.join(__dirname, '/text02.txt');
const writeTextToFile = fs.createWriteStream(textFilePath, { flags: 'a' }); // чтобы дописывалось, а не перезаписывалось

// readTextFromConsole.pipe(writeTextToFile); // У потока чтения вызывается метод pipe(), в который передается поток для записи.

const rl = readline.createInterface(readTextFromConsole);

const exitFromConsole = () => {
  console.log('Goodbye.');
  rl.close();
  writeTextToFile.end();
  process.exit();
};

// 'line'Событие генерируется всякий раз , когда input поток получает конец-линии (\n, \r или \r\n). Обычно это происходит, когда пользователь нажимает Enter или Return.
rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    exitFromConsole();
  }
  writeTextToFile.write(input + '\n'); // если пользователь ввел не 'exit', то записываем текст в файл
});

// 'SIGINT'Событие генерируется всякий раз, когда input поток получает Ctrl+C
process.on('SIGINT', exitFromConsole);
