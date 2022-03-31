const fs = require('fs');
const path = require('path');
const rubles = require('rubles').rubles;
const numWords = require('num-words');
const argv = require('minimist')(process.argv.slice(2));

const ARGS_NAMES = ['count', 'exact', 'english', 'output', '_'];
const OUTPUT_DIRECTORY = 'output';
const DEFAULT_OUTPUT_FILE_NAME = 'output.txt';

validateArguments();

main(Number(argv.count), argv.exact, argv.output, argv.english);

function main(count, isExact, outputFilename, isEnglish) {
	let str = '';
	let number = 1;

	const generator = isEnglish ? numWords : rubles;

	while(str.length < count) {
		str += `${generator(number)}`;
		number += 1;

		if (str.length < count) {
			str += ', ';
		}
	}

	const trimmedStr = isExact ? str.slice(0, count) : str;

	if (outputFilename) {
		const filename = typeof outputFilename === 'string' ? outputFilename : DEFAULT_OUTPUT_FILE_NAME;

		if (!fs.existsSync(OUTPUT_DIRECTORY)){
			fs.mkdirSync(OUTPUT_DIRECTORY)
		}

		const filePath = path.join(OUTPUT_DIRECTORY, filename);

		fs.writeFileSync(filePath, trimmedStr, { encoding: 'utf8' });
		console.log(`Текст записан в файл ${path.resolve(filePath)}`);
	} else {
		console.log(trimmedStr);
	}
	console.log();
	console.log(`Размер строки ${byteCount(trimmedStr)} байт (utf8)`);
	console.log(`Последнее число: ${number - 1}. В виде текста: ${generator(number - 1)}`);
}

function byteCount(s) {
    return Buffer.byteLength(s, 'utf8');
}

function validateArguments() {
	Object.keys(argv).forEach((arg) => {
		if (!ARGS_NAMES.includes(arg)) {
			console.error(`Неизвестный аргумент: ${argv.count}`);
			process.exit(1);
		}
	});

	if (Number.isNaN(argv.count)) {
		console.error(`Аргумент count должен быть числом. Получено: ${argv.count}`);
		process.exit(2);
	}

	if (typeof argv.output === 'string' && argv.output.includes('/')) {
		console.error('Имя выходного файла не должно содержать слэш');
		process.exit(3);
	}
}