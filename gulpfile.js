var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    variables = JSON.parse(fs.readFileSync('./variables.json'));

/**
 *  Main sass task
 */
gulp.task('sassMain', function() {
    gulp.src(variables.themePath + variables.sassFolder + 'screen.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(variables.themePath + variables.cssFolder))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(variables.themePath + variables.cssFolder));
});





gulp.task('default', function() {
    gulp.watch([variables.themePath + variables.sassFolder + '**/*.scss'],['sassMain']);
});