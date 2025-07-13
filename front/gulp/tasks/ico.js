import toIco from 'gulp-to-ico';

export const ico = () => {
  return app.gulp.src(`${app.paths.ico}`, {encoding: false}) // Указываем исходный файл явно
    .pipe(toIco('favicon.ico', {
      resize: true,
      sizes: [16, 24, 32, 64, 128, 256]
    }))
    .pipe(app.gulp.dest(`${app.paths.base.build}`)); // Перемещаем только результат конвертации
};

