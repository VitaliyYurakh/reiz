const srcFolder = './source';
const buildFolder = './build';

export const paths = {
    base: {
        src: srcFolder,
        build: buildFolder,
    },
    ico: `${srcFolder}/ico/**/*.png`,
    srcImgFolder: `${srcFolder}/img`,
    srcSvg: `${srcFolder}/img/sprite/**.svg`,

    srcFolderIcon: `${srcFolder}/img/icons`,

    buildImgSprite: `${buildFolder}/img/sprite`,

    buildImgFolder: `${buildFolder}/img`,
    srcScss: `${srcFolder}/scss/**/*.scss`,
    buildCssFolder: `${buildFolder}/css`,

    srcFontsFolder: `${srcFolder}/resources/fonts`,
    srcBuildFolder: `${buildFolder}/fonts`,

    srcFullJs: `${srcFolder}/js/**/*.js`,
    srcMainJs: `${srcFolder}/js/main.js`,
    buildJsFolder: `${buildFolder}/js`,

    srcPartialsFolder: `${srcFolder}/partials`,
    resourcesFolder: `${srcFolder}/resources`,
};
