// Выгружает все уроки в JSON (для проверки решений)
for (let i = 0; i < 7; i++) require(`../js/w${i}.js`);
process.stdout.write(JSON.stringify(globalThis.WORLDS));
