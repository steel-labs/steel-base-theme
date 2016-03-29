var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    shell = require('gulp-shell'),
    tinypng = require('gulp-tinypng-compress'),
    variables = JSON.parse(fs.readFileSync('./variables.json')),
    secretPath = './secret.json',
    secret = null;

function existsSync(filePath){
    try{
        fs.statSync(filePath);
    }catch(err){
        if(err.code == 'ENOENT') return false;
    }
    return true;
}


if(existsSync(secretPath)){
    secret = JSON.parse(fs.readFileSync(secretPath));
} else {
    console.log('---');
    console.log('No secret.json file provided.');
    console.log('---');
}

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
 *  Bower task
 */
gulp.task('bower', function() {
    gulp.src('*.js', {read: false})
        .pipe(shell('bower update'));

});


/**
 *  Vendors task
 */
gulp.task('vendors', function() {
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
 *  Minimise images task
 */

gulp.task('images', function () {
    if(secret && secret.TinyPng){
        gulp.src(variables.themePath + variables.imgFolder + '*.{png,jpg,jpeg}')
            .pipe(tinypng({
                key : secret.TinyPng,
                log: true,
                sameDest: true,
                sigFile: variables.themePath + variables.imgFolder + '.tinypng-sigs'
            }))
            .pipe(gulp.dest(variables.themePath + variables.imgFolder));
    } else {
        console.log('---');
        console.log('No TinyPng key provided.');
        console.log('---');
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
 *  Callable Task
 */
gulp.task('default', ['bower', 'vendors', 'sass-main', 'js-main', 'images', 'watch']);
gulp.task('deploy', ['vendors', 'sass-main', 'js-main', 'images']);