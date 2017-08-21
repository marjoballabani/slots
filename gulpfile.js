const gulp = require('gulp'),
    cache = require('gulp-cached'),
    cleaning = require('gulp-initial-cleaning'),
    concatCss = require('gulp-concat-css'),
    esLint = require('gulp-eslint'),
    inject = require('gulp-inject'),
    notifier = require('node-notifier'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    puglint = require('gulp-pug-lint'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    symlink = require('gulp-symlink'),
    statik = require('statik');

function _finished() {
    notifier.notify({
        title: 'Gulp ->',
        message: 'Finished :)'
    })
}

// Clean dist folder
cleaning({
    tasks: [
        'default',
        'look',
        'server',
        'prod'
    ],
    folders: ['dist']
});

/* ******************************
 * JS files
 * ******************************/
gulp.task('js-lint', () => {
    return gulp.src('src/**/*.js')
        .pipe(plumber())
        .pipe(esLint({
            quiet: () => {
                return true
            }
        }))
        .pipe(esLint.format())
});

gulp.task('json', () => {
    return gulp.src('src/public/**/*.json')
        .pipe(gulp.dest('dist/web/public/'));
});

gulp.task('server-js', () => {
    return gulp.src('src/main.js')
        .pipe(plumber())
        .pipe(esLint())
        .pipe(esLint.format())
        .pipe(esLint.failAfterError())
        .pipe(gulp.dest('dist/web'))
});

gulp.task('babelize-dev', () => {
    return gulp.src('src/public/**/*.js')
        .pipe(plumber())
        .pipe(cache('js-babel'))
        .pipe(gulp.dest('dist/web/public'))
});

/* ******************************
 * assets
 * ******************************/
gulp.task('assets-dev', () => {
    return gulp.src('src/public/commons/img/', { read: false })
        .pipe(symlink('dist/web/public/commons/img'));
});

/* ******************************
 * Symbolic links
 * ******************************/
gulp.task('components', () => {
    return gulp.src('bower_components/', { read: false })
        .pipe(symlink('dist/web/public/components'));
});

/* ******************************
 * CSS
 * ******************************/
gulp.task('sass-lint', () => {
    return gulp.src('src/**/*.sass')
        .pipe(plumber())
        .pipe(cache('sass-lint'))
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('sass-dev', ['sass-lint'], () => {
    return gulp.src('src/**/*.sass')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(concatCss('index.css'))
    .pipe(gulp.dest('dist/web/public'))
});

/* ******************************
 * PUG
 * ******************************/
gulp.task('pug-dev', () => {
    return gulp.src(['src/public/**/*.pug', '!src/public/index.pug'])
        .pipe(plumber())
        .pipe(cache('compiled-pug'))
        .pipe(puglint())
        .pipe(pug())
        .pipe(gulp.dest('dist/web/public'))
});

/* ******************************
 * INJECT
 * ******************************/
gulp.task('inject-dev', [
    'sass-dev',
    'pug-dev',
    'babelize-dev'
], () => {
    let config = require('./src/config')('dev');

    let _filesToInject = gulp.src([
        `dist/web/public/index.css`,
        'dist/web/public/commons/main.js',
        'dist/web/public/main.js',
        'dist/web/public/app/**/*.js',
        'dist/web/public/auth/**/*.js',
        'dist/web/public/commons/**/*.js'
    ], { read: false });

    return gulp.src('src/public/index.pug')
        .pipe(plumber())
        .pipe(puglint())
        .pipe(inject(_filesToInject, {
            ignorePath: 'dist/web/public/',
            addRootSlash: false
        }))
        .pipe(pug({ data: { config } }))
        .pipe(gulp.dest('dist/web/public'))
});


/* ******************************
 * GLOBAL
 * ******************************/
gulp.task('default', [
    'js-lint',
    'json',
    'server-js',
    'assets-dev',
    'inject-dev',
    'components',
], _finished);

gulp.task('_look', ['inject-dev'], _finished);

gulp.task('look', ['default', 'server'], () => {
    gulp.watch('src/**/*.*', ['_look'])
});

gulp.task('server', ['default'], () => {
    let port = process.env.PORT || 8081;
    statik({
        port: port,
        root: 'dist/web/public'
    });
    console.log(`Listening on port ${port}`)
});
