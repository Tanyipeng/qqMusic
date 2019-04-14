let gulp = require('gulp');
let less = require('gulp-less');
let debugClean = require('gulp-config-strip-debug');
let jsonFmt = require("gulp-json-fmt");

// 压缩文件
let htmlClean = require('gulp-htmlclean');
let cssClean = require('gulp-clean-css');
let uglifyJs = require('gulp-uglify');
let imageMin = require('gulp-imagemin');

//  开启服务器
let connect = require('gulp-connect');

let folder = {
  src: './src/',
  dist: './dist/'
};

// 获取node环境
// 设置环境：export NODE_ENV="development"
let devFlag = process.env.NODE_ENV === 'production';

gulp.task('html', () => {
  let firstTask = gulp.src(folder.src + 'html/*').pipe(connect.reload());
  devFlag && firstTask.pipe(htmlClean());
  firstTask.pipe(gulp.dest(folder.dist + 'html/'));
});

gulp.task('css', () => {
  let firstTask = gulp
    .src(folder.src + 'css/*')
    .pipe(connect.reload())
    .pipe(less());
  devFlag && firstTask.pipe(cssClean());
  firstTask.pipe(gulp.dest(folder.dist + 'css/'));
});

gulp.task('js', () => {
  let firstTask = gulp.src(folder.src + 'js/*').pipe(connect.reload());
  if (devFlag) {
    firstTask.pipe(debugClean()).pipe(uglifyJs());
  }
  firstTask.pipe(gulp.dest(folder.dist + 'js/'));
});

gulp.task('img', () => {
  gulp
    .src(folder.src + 'img/*')
    .pipe(connect.reload())
    .pipe(imageMin())
    .pipe(gulp.dest(folder.dist + 'img/'));
});

gulp.task('json', () => {
  gulp
    .src(folder.src + 'json/*.json')
    .pipe(connect.reload())
    .pipe(jsonFmt(jsonFmt.PRETTY))
    .pipe(gulp.dest(folder.dist + 'json/'));
});

gulp.task('watch', () => {
  gulp.watch(folder.src + 'html/*', ['html']);
  gulp.watch(folder.src + 'css/*', ['css']);
  gulp.watch(folder.src + 'js/*', ['js']);
  gulp.watch(folder.src + 'img/*', ['img']);
  gulp.watch(folder.src + 'json/*', ['json']);
});

gulp.task('server', () => {
  connect.server({
    port: 8888,
    livereload: true
  });
});

gulp.task('default', ['html', 'css', 'js', 'img', 'json', 'watch', 'server'], () =>
  console.log('ok')
);
