const p = require('./package.json');
const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const mocha = require('gulp-mocha');
const header = require('gulp-header');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

function errored(err) {
  console.error(err);
  this.emit('end');
}

const fileHeader = '/** Upload.js (${version}) | ${homepage} | ${license} */';

gulp.task('script', () =>
  browserify({ entries: './src/js/upload.js', extensions: ['.js'], debug: true })
  .transform(babelify, { presets: ['es2015'] })
  .bundle()
  .on('error', errored)
  .pipe(source('uploadjs.js'))
  .pipe(buffer())
  // .pipe(uglify())
  .pipe(header(fileHeader, p))
  .pipe(gulp.dest('dist'))
);

gulp.task('style', () =>
  gulp.src('src/css/*.scss')
  .pipe(sass({
    outputStyle: 'compressed',
  }).on('error', errored))
  .pipe(autoprefixer())
  .pipe(rename('uploadjs.css'))
  .pipe(header(fileHeader, p))
  .pipe(gulp.dest('dist'))
);

gulp.task('dist', ['script', 'style'], () => {});

gulp.task('test', () =>
  gulp.src('./test/**/*.test.js', { read: false })
  .pipe(mocha({
    require: ['babel-register'],
    reporter: 'progress',
  }))
);
