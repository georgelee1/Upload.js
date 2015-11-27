var p = require("./package.json")
var fs = require('fs');
var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglify");
var transpile  = require('gulp-es6-module-transpiler');
var mocha = require("gulp-mocha");
var babel = require("gulp-babel");
var header = require("gulp-header");
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require("gulp-rename");

function errored(err) {
    console.error(err);
    this.emit("end");
}

var fileHeader = "/** Upload.js (${version}) | ${homepage} | ${license} */";

gulp.task("script", function() {
    return browserify({entries: "./src/js/upload.js", extensions: [".js"], debug: true})
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .on("error", errored)
        .pipe(source("uploadjs.js"))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(header(fileHeader, p))
        .pipe(gulp.dest("dist"));
})

gulp.task("style", function() {
    return gulp.src("src/css/*.scss")
        .pipe(sass({
            outputStyle: "compressed"
         }).on("error", errored))
        .pipe(autoprefixer())
        .pipe(rename("uploadjs.css"))
        .pipe(header(fileHeader, p))
        .pipe(gulp.dest("dist"));
})

gulp.task("dist", ["script", "style"], function () {});

gulp.task("build-test", function () {
    return gulp.src("test/tests.js")
        .pipe(transpile({
            formatter: "bundle"
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest("build"));
});

gulp.task("test", ["build-test"], function () {
    return gulp.src("./build/test/tests.js", {read: false})
        .pipe(mocha({reporter: "spec"}));
});