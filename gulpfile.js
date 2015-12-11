var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect');


//connect server
gulp.task('connect', function() {
    connect.server({
        root: __dirname,
        livereload: true
    });
});

//css
gulp.task('sass', function() {
    return gulp.src('./public/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css/'))
        .pipe(connect.reload());
});

//html
gulp.task('html', function() {
    gulp.src('./public/html/*.html')
        .pipe(connect.reload());
});


//watch
gulp.task('watch', function() {
    gulp.watch('./public/sass/*.sass',['sass']);
    gulp.watch('./public/html/*.html',['html'])
});

gulp.task('default',['html','sass', 'connect','watch']);