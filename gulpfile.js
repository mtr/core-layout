var _ = require('lodash'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    cached = require('gulp-cached'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    dateFormat = require('dateformat'),
    footer = require('gulp-footer'),
    ghPages = require('gulp-gh-pages'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    htmlify = require('gulp-angular-htmlify'),
    htmlmin = require('gulp-htmlmin'),
    jshint = require('gulp-jshint'),
    gulpNgAnnotate = require('gulp-ng-annotate'),
    browserifyNgAnnotate = require('browserify-ngannotate'),
    pkg = require('./package.json'),
    path = require('path'),
    preprocessify = require('preprocessify'),
    prettyBytes = require('pretty-bytes'),
//process = require('process'),
    remember = require('gulp-remember'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    templateCache = require('gulp-angular-templatecache'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify'),
    libBundleName = 'core-layout.js',
    examplesBundleName = 'bundle.js',
    libDestRoot = 'dist/lib/',
    examplesDestRoot = 'dist/examples/',
    paths = {
        lib: {
            src: path.join('src/lib', libBundleName),
            templates: 'src/lib/core-layout.templates.js',
            html: path.join('src/lib', '*.html'),
            dest: 'dist/lib/',
            index: {
                src: './src/examples/index.html',
                dest: libDestRoot
            },
            js: {
                bundleName: libBundleName,
                src: './src/examples/app.js',
                dest: path.join(libDestRoot, 'js')
            },
            style: {
                src: './src/examples/scss/style.scss',
                dest: path.join(libDestRoot, 'css'),
                bootstrap: {
                    assets: './node_modules/bootstrap-sass/assets/',
                    sass: './node_modules/bootstrap-sass/assets/stylesheets/'
                }
            },
            templateCache: {
                module: 'coreLayout.templates',
                name: 'core-layout.templates.js',
                dest: 'src/lib'
            }
        },
        examples: {
            src: './src/examples/',
            root: examplesDestRoot,
            index: {
                src: './src/examples/index.html',
                dest: examplesDestRoot
            },
            js: {
                bundleName: examplesBundleName,
                src: './src/examples/app.js',
                dest: path.join(examplesDestRoot, 'js')
            },
            style: {
                src: './src/examples/scss/style.scss',
                dest: path.join(examplesDestRoot, 'css'),
                bootstrap: {
                    assets: './node_modules/bootstrap-sass/assets/',
                    sass: './node_modules/bootstrap-sass/assets/stylesheets/'
                }
            }
        }
    },
    libBrowserifyStats = {
        bytes: null,
        time: null
    },
    examplesBrowserifyStats = {
        bytes: null,
        time: null
    },
    libBundler = watchify(browserify(_.extend({
        entries: paths.lib.js.src,
        debug: true
    }, watchify.args))),
    examplesBundler = watchify(browserify(_.extend({
        entries: paths.examples.js.src,
        debug: true
    }, watchify.args)));

//process.env.BROWSERIFYSHIM_DIAGNOSTICS = 1;

function _getNow() {
    return new Date();
}

gulp.task('scss', function () {
    return gulp.src('src/lib/_*.scss')
        .pipe(gulp.dest('dist/scss'));
});

gulp.task('cache-angular-templates', function () {
    /* The returned stream is a hint to tell it when the task is done.
     Either take in a callback and call it when you're done or return a
     promise or stream that the engine should wait to resolve or end
     respectively.   If not, the watchify task would start running before
     this one is finished. */
    return gulp.src(paths.lib.html)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(htmlify())
        .pipe(templateCache({
            filename: paths.lib.templateCache.name,
            module: paths.lib.templateCache.module,
            standalone: true,
            root: 'views',
            //moduleSystem: 'browserify',
            templateHeader: "(function (module, window) {" +
            "'use strict'; " +
            "module.exports = angular.module('<%= module %>'<%= standalone %>)" +
            ".run(['$templateCache', function($templateCache) { ",
            templateFooter: "}]); })(module, window);"
        }))
        .pipe(gulp.dest(paths.lib.templateCache.dest));
});

gulp.task('lib', ['cache-angular-templates'], function () {
    var now = _getNow();

    return gulp.src([paths.lib.templates, paths.lib.src])
        .pipe(cached('lib'))            // Only pass through changed files.
        .pipe(jshint())
        .pipe(concat(libBundleName)) // Do things that require all files.
        .pipe(header('/**\n' +
        ' * @license <%= pkg.name %> v<%= pkg.version %>, <%= now %>\n' +
        ' * (c) <%= years %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
        ' * License: <%= pkg.license %>\n' +
        ' */\n', {
            now: dateFormat(now, "isoDateTime"),
            years: dateFormat(now, "yyyy"),
            pkg: pkg
        }))
        .pipe(footer('\n'))
        .pipe(remember('lib'))          // Add back all files to the stream.
        .pipe(gulpNgAnnotate())
        .pipe(gulp.dest(paths.lib.dest))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.lib.dest));

});

gulp.task('watch', function () {
    var watcher = gulp.watch([paths.lib.src, paths.lib.html], ['lib']);

    gulp.watch(['src/lib/_*.scss'], ['scss']);

    watcher.on('change', function _srcChanged(event) {
        if (event.type === 'deleted') {
            delete cached.caches.lib[event.path];
            remember.forget('lib', event.path);
        }
    });
});

gulp.task('default', ['scss', 'cache-angular-templates', 'lib']);


gulp.task('browser-sync', function () {
    browserSync({
        open: false,  // You have to manually open 'http://localhost:3000/'.
        server: {
            baseDir: paths.examples.root
        }
    });
});

gulp.task('connect', function () {
    connect.server({
        root: paths.examples.root,
        port: 3001,
        livereload: true
    });
});

gulp.task('bootstrap-assets', function () {
    gulp.src(path.join(
        paths.examples.style.bootstrap.assets, '@(fonts|images)/**/*'))
        .pipe(gulp.dest(paths.examples.root));
});

gulp.task('style', ['bootstrap-assets' /*, 'wrap-vendor-css'*/], function () {
    return sass(paths.examples.style.src, {
        loadPath: [paths.examples.style.bootstrap.sass],
        compass: true,
        sourcemap: true,
        style: 'compact'
    })
        .on('error', gutil.log.bind(gutil, 'Sass/Compass Error'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.examples.style.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('demo-views', function () {
    return gulp.src(path.join(paths.examples.src, '**/*.html'))
        .pipe(gulp.dest(paths.examples.index.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('views', ['demo-views'], function () {
    return gulp.src(paths.examples.index.src)
        //.pipe(htmlmin({
        //    collapseWhitespace: true,
        //    removeComments: true
        //}))
        //.pipe(htmlify())
        .pipe(gulp.dest(paths.examples.index.dest))
        .pipe(browserSync.reload({stream: true}));
});

function decorateBundler(meta) {
    meta.bundle = function bundle() {
        gutil.log("Starting '" + gutil.colors.cyan("browserify-rebundle (" +
        paths.js.bundleName + ")") + "' ...");

        return meta.bundler.bundle()
            // log errors if they happen
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(paths.js.bundleName))
            // Optional, remove if you don't want sourcemaps.
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
            .pipe(sourcemaps.write('./')) // writes .map file
            //
            .pipe(gulp.dest(meta.paths.js.dest))
            .pipe(browserSync.reload({stream: true}));
    }

// Add any other browserify options or transforms here.
    meta.bundler
        .transform(preprocessify({
            now: dateFormat(_getNow(), "isoDateTime"),
            pkg: pkg
        }))
        .transform(browserifyNgAnnotate)
        .on('update', meta.bundle)
        .on('bytes', function (bytes) {
            meta.stats.bytes = bytes;
        })
        .on('time', function (time) {
            meta.stats.time = time;
        })
        .on('log', function () {
            gutil.log("Finished '" + gutil.colors.cyan("browserify-rebundle") + "' after",
                gutil.colors.magenta((meta.stats.time / 1000).toFixed(2) + " s"));
            gutil.log('Browserify bundled',
                gutil.colors.cyan(prettyBytes(meta.stats.bytes)), 'into',
                gutil.colors.magenta(paths.js.bundleName));
        });

    gulp.task('rebundle-' + meta.name, function () {
        return meta.bundle();
    });
}

var libMeta = {
        name: 'lib',
        bundler: libBundler,
        paths: paths.lib,
        stats: libBrowserifyStats
    },
    examplesMeta = {
        name: 'examples',
        bundler: examplesBundler,
        paths: paths.examples,
        state: examplesBrowserifyStats
    };

decorateBundler(libMeta);
decorateBundler(examplesMeta);

gulp.task('watch-examples', function () {
    gulp.watch(path.join(paths.lib.dest, 'core-layout.js'), ['rebundle-examples']);
    gulp.watch(paths.examples.index.src, ['views']);
    gulp.watch(path.join(paths.examples.src, '**/*.html'), ['demo-views']);
    gulp.watch([paths.examples.style.src,
        path.join(paths.examples.src, '**/*.scss')], ['style']);
});

gulp.task('examples', [
    'connect',
    'browser-sync',
    'style',
    'views',
    'watch-examples'
], examplesMeta.bundle);

gulp.task('deploy', function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});
