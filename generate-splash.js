const puppeteer = require('puppeteer');
const path = require('path');

async function generateSplash() {
  console.log('Запускаю браузер...');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Устанавливаем размер viewport
  await page.setViewport({
    width: 1284,
    height: 2778,
    deviceScaleFactor: 1
  });

  // Открываем HTML файл
  const htmlPath = path.join(__dirname, 'splash-generator.html');
  await page.goto(`file://${htmlPath}`);

  console.log('Генерирую splash screen...');

  // Находим элемент splash и делаем скриншот
  const splashElement = await page.$('#splash');
  await splashElement.screenshot({
    path: path.join(__dirname, 'assets', 'splash.png'),
    type: 'png'
  });

  await browser.close();

  console.log('Готово! Сохранено в assets/splash.png');
}

generateSplash().catch(err => {
  console.error('Ошибка:', err.message);
  process.exit(1);
});
