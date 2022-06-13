const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const reload = browserSync.reload;

function defaultTask(cb) {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    })
    gulp.watch("./src/*.html").on("change", reload);
}

exports.default = defaultTask;