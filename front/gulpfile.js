import gulp from 'gulp';
import browserSync from 'browser-sync';

import {paths} from './gulp/config/paths.js';
import {clean} from './gulp/tasks/clean.js';
import {svgSprites} from './gulp/tasks/sprite.js';
import {styles} from './gulp/tasks/styles.js';
import {ico} from './gulp/tasks/ico.js';
import {stylesBackend} from './gulp/tasks/styles-backend.js';
import {scripts} from './gulp/tasks/scripts.js';
import {scriptsBackend} from './gulp/tasks/scripts-backend.js';
import {resources} from './gulp/tasks/resources.js';
import {images} from './gulp/tasks/images.js';
import {webpImages} from './gulp/tasks/webp.js';
import {htmlInclude} from './gulp/tasks/html-include.js';
import {cacheTask} from './gulp/tasks/cache.js';
import {rewrite} from './gulp/tasks/rewrite.js';
import {htmlMinify} from './gulp/tasks/html-minify.js';
import {zipFiles} from './gulp/tasks/zip.js';
import {svgIcons} from './gulp/tasks/iconmoon.js';

global.app = {
    gulp,
    isProd: process.argv.includes('--build'),
    paths,
};

const watcher = () => {
    browserSync.init({
        server: {
            baseDir: `${app.paths.base.build}`,
        },
        notify: false,
        port: 3001,
    });

    gulp.watch(app.paths.srcScss, styles);
    gulp.watch(app.paths.srcFullJs, scripts);
    gulp.watch(`${app.paths.srcPartialsFolder}/**/*.html`, htmlInclude);
    gulp.watch(`${app.paths.base.src}/**/*.html`, htmlInclude);
    gulp.watch(`${app.paths.resourcesFolder}/**`, resources);
    gulp.watch(`${app.paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`, images);
    gulp.watch(`${app.paths.ico}`, ico);
    gulp.watch(`${app.paths.srcImgFolder}/**/**.{jpg,jpeg,png,webp}`, webpImages);
    gulp.watch(app.paths.srcSvg, svgSprites);
    gulp.watch(app.paths.srcSvg, svgIcons);
};

const start = gulp.series(
    clean,
    resources,
    htmlInclude,
    svgIcons,
    styles,
    scripts,
    images,
    ico,
    webpImages,
    svgSprites,
    watcher
);
// const start = gulp.series(clean, resources, images ,, watcher);
const backend = gulp.series(
    clean,
    htmlInclude,
    scriptsBackend,
    stylesBackend,
    resources,
    images,
    ico,
    webpImages,
    svgSprites
);
const build = gulp.series(
    clean,
    htmlInclude,
    scripts,
    styles,
    resources,
    images,
    webpImages,
    ico,
    svgSprites,
    htmlMinify
);
const cache = gulp.series(cacheTask, rewrite);
const zip = zipFiles;

export {start};
export {build};
export {backend};
export {cache};
export {zip};

gulp.task('default', start);
