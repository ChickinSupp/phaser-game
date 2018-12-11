//Dependencies
require("@babel/register");
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
//const concat = require('gulp-concat');
const del = require('del');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const runSequence = require('run-sequence');

/**
 * Config
 */

//Travis CI
gulp.task('travis', ['build'], function () {
    process.exit(0);
});

const paths = {
    scripts: {
        src: './app/public/client/**/*.js',
        dest: './dist/scripts/'
    },
    views: './app/views/*.html',
    server: './app/public/server/server.js',
    distServer: [
        './dist/server/bin/www'
    ]
};

//Dist configuration
const distConfig = {
    script: paths.distServer,
    ext: 'html js css',
    ignore: ['node_modules']
};

//Nodemon config
const nodemonConfig = {
    script: paths.server,
    ext: 'html js css',
    ignore: ['node_modules']
};

/*________GULP TASKS________
_________________________________*/

//DUMP DIST FOLDER
gulp.task('clean', function() {
    del(['./dist/*']).then (paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

//LINT
gulp.task('lint', function() {
    return gulp.src(paths.scripts.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

//BROWSERSYNC
gulp.task('browser-sync', ['nodemon'], function(done) {
    browserSync({
        proxy: "localhost:3000",  // local node app address
        port: 5000,  // use *different* port than above
        notify: true
    }, done);
});

//SERVER
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
                reload();
            }, 1000);
        });
});

//MINIFY SCRIPTS
gulp.task('minify-js', function() {
    gulp.src(paths.scripts.src)
        .pipe(uglify())
        .pipe(gulp.dest('./dist/client/js/'));
});

//COPY SERVER FILES
gulp.task('cp-Servefiles', function () {
    gulp.src('./src/server/**/*')
        .pipe(gulp.dest('./dist/server/'));
});

//CONNECT DIST SERVER
gulp.task('connectDist', function (cb) {
    var called = false;
    return nodemon(distConfig)
        .on('start', function () {
            if (!called) {
                called = true;
                cb();
            }
        })
        .on('restart', function () {
            setTimeout(function () {
                reload();
            }, 1000);
        });
});

//WATCH
gulp.task('watch', function() {
    gulp.watch(paths.scripts.src, ['lint']);
});

//DEFAULT
gulp.task('default', ['browser-sync', 'watch'], function(){});

//BUILD
gulp.task('build', function() {
    runSequence(
        ['clean'],
        ['lint', 'minify-js', 'cp-Servefiles', 'connectDist']
    );
});

