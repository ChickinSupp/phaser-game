//Dependencies
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

/**
 * Config
 */

var paths = {
    scripts: [
        './public/client/js/*.js',
    ],
    server:
        './src/server/app.js',
};

var nodemonConfig = {
    script: paths.server,
    ext: 'html js css',
    ignore: ['node_modules']
};

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon(nodemonConfig)
        .on('start', function () {
            if (!called) {
                called = true;
                cb();
            }
        })
        .on('restart', function () {
            setTimeout(function () {
                reload({ stream: false });
            }, 1000);
        });
});

gulp.task('browser-sync', ['nodemon'], function(done) {
    browserSync({
        proxy: "localhost:3000",  // local node app address
        port: 5000,  // use *different* port than above
        notify: true
    }, done);
});

gulp.task('minify-js', function() {
    return new Promise(function(resolve, reject) {
        gulp.src(paths.scripts)
            .pipe(uglify())
            .pipe(gulp.dest('./dist/client/js/'));
        resolve();
    });
});

gulp.task('lint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, gulp.series('lint'));
});

// *** default task *** //
gulp.task('default', ['browser-sync', 'watch'], function(){});