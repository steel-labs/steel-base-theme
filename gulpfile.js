var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    cssmin = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    plumber = require('gulp-plumber'),
    shell = require('gulp-shell'),
    copy = require('gulp-copy'),
    tinypng = require('gulp-tinypng-compress'),
    handlebars = require('gulp-compile-handlebars'),
    variables = JSON.parse(fs.readFileSync('./variables.json')),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    connect = require('gulp-connect'),
    secretPath = './secret.json',
    secret = null,
    existsSync = function(filePath){
        try{
            fs.statSync(filePath);
        }catch(err){
            if(err.code == 'ENOENT') return false;
        }
        return true;
    },
    plumberHelper = function(obj, err) {
        console.log(err);
        this.emit('end');
    };


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
    return gulp.src(variables.themePath + variables.sassFolder + 'screen.scss')
        .pipe(plumber({
                handleError: function(){plumberHelper(this, err);}
            }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(variables.themePath + variables.cssFolder));
});


gulp.task('css-minify', function() {
    return gulp.src(variables.themePath + variables.cssFolder + 'screen.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(variables.themePath + variables.cssFolder))
        .pipe(connect.reload());
});

/**
 *  Main JS task
 */
gulp.task('js-main', function() {
    gulp.src(variables.themePath + variables.jsFolder + '/modules/*.js')
        .pipe(plumber({
                handleError: function(){plumberHelper(this, err);}
            }))
        .pipe(concat('main.js'))
        .pipe(replace('@__THEMEDIR__', variables.themePathWebroot))
        .pipe(gulp.dest(variables.themePath + variables.jsFolder))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(variables.themePath + variables.jsFolder))
        .pipe(connect.reload());
});


/**
 *  Vendors task
 */
gulp.task('vendors', function() {
    // vendor js concat and min
    if(variables.jsVendorsPath.length){
        gulp.src(variables.jsVendorsPath)
            .pipe(plumber({
                handleError: function(){plumberHelper(this, err);}
            }))
            .pipe(concat('vendors.js'))
            .pipe(gulp.dest(variables.themePath + variables.jsFolder))
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(variables.themePath + variables.jsFolder));
    }

    // vendor css concat and min
    if(variables.cssVendorsPath.length){
        gulp.src(variables.cssVendorsPath)
            .pipe(plumber({
                handleError: function(){plumberHelper(this, err);}
            }))
            .pipe(concat('vendors.css'))
            .pipe(gulp.dest(variables.themePath + variables.cssFolder))
            .pipe(cssmin())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(variables.themePath + variables.cssFolder));
    }

    // vendor assets
    for (var path in variables.assetsVendorsPath){
        var files = variables.assetsVendorsPath[path];
        for(var i = 0; i < files.length; i++){
            console.log(path + files[i]);
            gulp.src(files[i], {cwd: path})
                .pipe(copy(variables.themePath + variables.cssFolder))
        }
    }
});

/**
 *  Minimise images task
 */

gulp.task('images', function () {
    if(secret && secret.TinyPng){
        gulp.src(variables.themePath + variables.imgFolder + '*.{png,jpg,jpeg}')
            .pipe(plumber({
                handleError: function(){plumberHelper(this, err);}
            }))
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
 *  Build html
 */

gulp.task('html', function () {
    var templateData = {
        },
        options = {
            batch : [variables.themePath + variables.partialsFolder + variables.includesFolder]
        };

    return gulp.src([
        variables.themePath + variables.partialsFolder + variables.layoutsFolder + '*.hbs'
    ])
        .pipe(plumber({
            handleError: function(){plumberHelper(this, err);}
        }))
        .pipe(handlebars(templateData, options))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(gulp.dest('./'));
});

/**
 *  Watch
 */
gulp.task('watch', function() {
    watch(variables.themePath + variables.sassFolder + '**/*.scss', batch(function (events, done) {
        events.on('data', function(){
            runSequence('sass-main', 'css-minify');
        }).on('end', done);
    }));

    watch([variables.themePath + variables.jsFolder + 'modules/*.js'], batch(function (events, done) {
        events.on('data', function(){
            runSequence('js-main');
        }).on('end', done);
    }));

    watch([variables.themePath + variables.partialsFolder + '**/*.hbs'], batch(function (events, done) {
        events.on('data', function(){
            runSequence('html');
        }).on('end', done);
    }));
});

gulp.task('connect', function() {
    connect.server({
        port: 3000,
        livereload: true
    });
});

gulp.task('up', function() {
    runSequence(['deploy', 'connect', 'watch']);
});

/**
 *  Callable Task
 */
gulp.task('deploy', function(){
    runSequence('vendors', 'html', 'sass-main', 'css-minify', 'js-main');
});

gulp.task('default', function(){
    runSequence('deploy', 'watch');
});