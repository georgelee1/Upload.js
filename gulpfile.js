var p = require("./package.json")
var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglify");
var transpile  = require('gulp-es6-module-transpiler');
var mocha = require("gulp-mocha");
var babel = require("gulp-babel");

gulp.task("dist", function () {
    return browserify({entries: "./src/js/upload.js", extensions: [".js"], debug: true})
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .on("error", function (err) {
            console.error(err);
            this.emit("end");
        })
        .pipe(source("upload-" + p.version + ".js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task("watch", ["build"], function () {
    gulp.watch("**/*.js", ["build"]);
});

gulp.task("build", function () {
    return gulp.src("test/tests.js")
        .pipe(transpile({
            formatter: "bundle"
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest("build"));
});

gulp.task("test", ["build"], function () {
    return gulp.src("./build/test/tests.js", {read: false})
        .pipe(mocha({reporter: "spec"}));
});