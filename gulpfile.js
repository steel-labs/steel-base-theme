var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    shell = require('gulp-shell'),
    variables = JSON.parse(fs.readFileSync('./variables.json'));

/**
 *  Main sass task
 */
gulp.task('sass-main', function() {
    gulp.src(variables.themePath + variables.sassFolder + 'screen.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(variables.themePath + variables.cssFolder))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(variables.themePath + variables.cssFolder));
});

/**
 *  Main JS task
 */
gulp.task('js-main', function() {
    gulp.src(variables.themePath + variables.jsFolder + '/modules/*.js')
        .pipe(concat('main.js'))
        .pipe(replace('@__THEMEDIR__', variables.themePathWebroot))
        .pipe(gulp.dest(variables.themePath + variables.jsFolder))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(variables.themePath + variables.jsFolder));
});

/**
 *  Vendors task
 */
gulp.task('vendors', function() {
    // shell task
    gulp.src('*.js', {read: false})
        .pipe(shell('bower update'));

    // vendor js concat and min
    if(variables.jsVendorsPath.length){
        gulp.src(variables.jsVendorsPath)
            .pipe(concat('vendors.js'))
            .pipe(gulp.dest(variables.themePath + variables.jsFolder))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(variables.themePath + variables.jsFolder));
    }

    // vendor css concat and min
    if(variables.cssVendorsPath.length){
        gulp.src(variables.cssVendorsPath)
            .pipe(concat('vendors.css'))
            .pipe(gulp.dest(variables.themePath + variables.cssFolder))
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(variables.themePath + variables.cssFolder));
    }
});

/**
 *  Watch
 */
gulp.task('watch', function() {
    gulp.watch([variables.themePath + variables.sassFolder + '**/*.scss'],['sass-main']);
    gulp.watch([variables.themePath + variables.jsFolder + 'modules/*.js'],['js-main']);
});

/**
 *  Default Task
 */
gulp.task('default', ['vendors', 'sass-main', 'js-main']);