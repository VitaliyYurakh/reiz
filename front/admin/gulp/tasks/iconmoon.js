import gulp from "gulp";
import iconfont from "gulp-iconfont";
import iconfontCss from "gulp-iconfont-css";
import svgmin from "gulp-svgmin";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";

const fontName = "iconmoon"; // Имя шрифта

export const svgIcons = () => {
    return gulp.src(`${app.paths.srcFolderIcon}/*.svg`, { encoding: false })
        // Минифицируем SVG
        .pipe(svgmin({
            js2svg: { pretty: true }
        }))
        // Меняем stroke → fill, потом fill → currentColor (учитываем, если их нет)
        .pipe(cheerio({
            run: function ($) {
                $("[stroke]").each(function () {
                    const strokeColor = $(this).attr("stroke");
                    if (strokeColor) {
                        $(this).attr("fill", strokeColor);
                        $(this).removeAttr("stroke");
                    }
                });

                $("[fill]").each(function () {
                    $(this).attr("fill", "currentColor");
                });
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(replace("&gt;", ">")) // Фиксим `>` символ
        // Создаём CSS для шрифтов
        .pipe(iconfontCss({
            fontName: fontName,
            path: "node_modules/gulp-iconfont-css/templates/_icons.scss",
            targetPath: "../../scss/general/_icomoon.scss",
            fontPath: "../fonts/"
        }))
        // Генерируем иконочный шрифт
        .pipe(iconfont({
            fontName: fontName,
            formats: ["woff2", "woff", "ttf"],
            normalize: true,
            fontHeight: 512, // Попробуем уменьшить
            fixedWidth: true,
            centerHorizontally: true,
        }))
        .pipe(gulp.dest(app.paths.srcFontsFolder)); // Сохранение в build
};
