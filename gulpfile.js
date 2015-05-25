var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    using = require('gulp-using'),
    jade = require('gulp-jade'),
    //uglifyjs = require('gulp-uglify'),
    //minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin');

var paths = {
    dest: 'public',
    styles: ['source/**/*.css'],
    scripts: ['source/**/*.js'],
    templates: ['source/**/*.jade', '!source/**/_*.jade'],
    images: ['source/*.jpg', 'source/*.png']
};

gulp.task('plugins', function() {
    var files = [
        'bower_components/angular/angular-csp.css',
        'bower_components/angular/angular.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular/angular.min.js.map',
        'bower_components/ng-file-upload/ng-file-upload.js',
        'bower_components/ng-file-upload/ng-file-upload.min.js',
        'bower_components/canvas-to-blob/js/canvas-to-blob.min.js',
        'bower_components/jquery/dist/**/*.*',
        'bower_components/materialize/dist/**/*.*'
    ];
    return gulp.src(files)
        .pipe(using())
        .pipe(gulp.dest(paths.dest + '/plugins'));
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(using())
        .pipe(concat('site.js'))
        //.pipe(uglifyjs())
        .pipe(gulp.dest(paths.dest));
});

gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(using())
        .pipe(concat('site.css'))
        //.pipe(minifycss())
        .pipe(gulp.dest(paths.dest));
});

gulp.task('templates', function() {
    var options = {
        pretty: true
    };
    return gulp.src(paths.templates)
        .pipe(using())
        .pipe(jade(options))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('images', function() {
    var options = {
        progressive: true
    };
    return gulp.src(paths.images)
        .pipe(using())
        .pipe(imagemin(options))
        .pipe(gulp.dest(paths.dest + '/photos'));
});

gulp.task('build', ['plugins', 'scripts', 'styles', 'templates', 'images']);

gulp.task('server', ['build'], function() {
    var all = function (source) {
        return source.filter(function(path) { return path[0] != '!'; });
    };
    gulp.watch(all(paths.styles), ['styles']);
    gulp.watch(all(paths.scripts), ['scripts']);
    gulp.watch(all(paths.templates), ['templates']);
    gulp.watch(all(paths.images), ['images']);

    var options = {
        livereload: false,
        open: false
    };
    return gulp.src(paths.dest)
        .pipe(webserver(options));
});

gulp.task('default', ['build']);