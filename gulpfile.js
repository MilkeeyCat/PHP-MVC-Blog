const 
gulp = require("gulp"),
sass = require("gulp-sass"),
autoprefixer = require("gulp-autoprefixer"),
cleancss = require("gulp-clean-css"),
rename = require("gulp-rename"),
livereload = require("gulp-livereload");

gulp.task("autoreload-scss", () => {
    return gulp.src("scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({
        browsers: "last 3 versions",
        cascade: false
    }))
    .pipe(gulp.dest("css/"))
    .pipe(cleancss({compability: "ie8"}))
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("css/"))
    .pipe(livereload());

    gulp.series("autoreload-html");
});
gulp.task("autoreload-html", () => {
    return gulp.src("../app/views/**/*.html")
    .pipe(livereload());
});
gulp.task("autoreload-js", () => {
    return gulp.src("js/*.js")
    .pipe(livereload());

    gulp.series("autoreload-html");
});
gulp.task("default", () => {
    livereload.listen();
    gulp.watch("scss/**/*.scss", gulp.series('autoreload-scss'));
    gulp.watch("js/*.js", gulp.series('autoreload-js'));
    gulp.watch("../app/views/**/*.html", gulp.series('autoreload-html'));
});