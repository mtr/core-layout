// Allow global 'use strict' and undefined require.
// jshint -W097
// jshint -W117
'use strict';

var _ = require('lodash'),
    autoPrefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    bump = require('gulp-bump'),
    cached = require('gulp-cached'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    dateFormat = require('dateformat'),
    filter = require('gulp-filter'),
    footer = require('gulp-footer'),
    git = require('gulp-git'),
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
    pump = require('pump'),
    remember = require('gulp-remember'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    tag_version = require('gulp-tag-version'),
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
    }, watchify.args))),
    autopreFixerConfig = {
        browsers: [
            'last 4 version',
            '> 0.9%',
            '> 0.9% in NO',
            '> 0.9% in SE',
            '> 0.9% in DE',
            '> 0.9% in DK',
            '> 0.9% in GB',
            '> 0.9% in NL',
            'Android 2.3',
            'Chrome 37',
            'IE >= 9',
            'Firefox ESR',
            'Firefox 15',
            'Firefox 32',
            'Opera 12'
        ]
    };

//process.env.BROWSERIFYSHIM_DIAGNOSTICS = 1;

function _getNow() {
    return new Date();
}

gulp.task('scss', function () {
    return gulp.src('src/lib/_*.scss')
        .pipe(gulp.dest('dist/scss'));
});

gulp.task('cache-angular-templates', function (cb) {
    /* The returned stream is a hint to tell it when the task is done.
     Either take in a callback and call it when you're done or return a
     promise or stream that the engine should wait to resolve or end
     respectively.   If not, the watchify task would start running before
     this one is finished. */
    pump([
        gulp.src(paths.lib.html),
        htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }),
        htmlify(),
        templateCache({
            filename: paths.lib.templateCache.name,
            module: paths.lib.templateCache.module,
            standalone: true,
            //moduleSystem: 'browserify',
            templateHeader: "(function (module, window) {" +
            "'use strict'; " +
            "module.exports = angular.module('<%= module %>'<%= standalone %>)" +
            ".run(['$templateCache', function($templateCache) { ",
            templateFooter: "}]); })(module, window);"
        }),
        gulp.dest(paths.lib.templateCache.dest)
    ], cb);
});

gulp.task('lib', ['cache-angular-templates'], function (cb) {
    var now = _getNow();

    pump([
        gulp.src([paths.lib.templates, paths.lib.src]),
        cached('lib'),            // Only pass through changed files.
        jshint(),
        concat(libBundleName), // Do things that require all files.
        header('/**\n' +
            ' * @license <%= pkg.name %> v<%= pkg.version %>, <%= now %>\n' +
            ' * (c) <%= years %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
            ' * License: <%= pkg.license %>\n' +
            ' */\n', {
            now: dateFormat(now, "isoDateTime"),
            years: dateFormat(now, "yyyy"),
            pkg: pkg
        }),
        footer('\n'),
        remember('lib'),          // Add back all files to the stream.
        gulpNgAnnotate(),
        gulp.dest(paths.lib.dest),
        uglify({output: {comments: /^!|@preserve|@license|@cc_on/i}}),
        rename({
            extname: '.min.js'
        }),
        gulp.dest(paths.lib.dest)
    ], cb);
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
        loadPath: [paths.examples.style.bootstrap.sass, './src/lib/'],
        sourcemap: true,
        style: 'compact'
    })
        .on('error', gutil.log.bind(gutil, 'Sass/Compass Error'))
        .pipe(autoPrefixer(autopreFixerConfig))
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
            meta.paths.js.bundleName + ")") + "' ...");

        return meta.bundler.bundle()
        // log errors if they happen
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source(meta.paths.js.bundleName))
            // Optional, remove if you don't want sourcemaps.
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
            .pipe(sourcemaps.write('./')) // writes .map file
            //
            .pipe(gulp.dest(meta.paths.js.dest))
            .pipe(browserSync.reload({stream: true}));
    };

// Add any other browserify options or transforms here.
    meta.bundler
        .transform('preprocessify', {
            now: dateFormat(_getNow(), "isoDateTime"),
            pkg: pkg
        })
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
                gutil.colors.magenta(meta.paths.js.bundleName));
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
        stats: examplesBrowserifyStats
    };

decorateBundler(libMeta);
decorateBundler(examplesMeta);

gulp.task('watch-examples', function () {
    gulp.watch(path.join(paths.lib.dest, 'core-layout.js'), ['rebundle-examples']);
    gulp.watch(paths.examples.index.src, ['views']);
    gulp.watch(path.join(paths.examples.src, '**/*.html'), ['demo-views']);
    gulp.watch([paths.examples.style.src,
        path.join(paths.examples.src, '**/*.scss'),
        'dist/scss/*.scss'], ['style']);
});

gulp.task('examples', [
    'connect',
    'browser-sync',
    'style',
    'views',
    'watch-examples'
], examplesMeta.bundle);


function increaseVersion(importance) {
    // Get all the files to bump version in.
    return gulp.src(['./package.json'])
    // Bump the version number in those files.
        .pipe(bump({type: importance}))
        // Save it back to filesystem.
        .pipe(gulp.dest('./'))
        // Commit the changed version number.
        .pipe(git.commit('Bumped package version.'))

        // Read only one file to get the version number.
        .pipe(filter('package.json'))
        // Tag it in the repository.
        .pipe(tag_version());
}

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature, or made a backwards-incompatible release.
 */
gulp.task('patch', function () {
    return increaseVersion('patch');
});
gulp.task('feature', function () {
    return increaseVersion('minor');
});
gulp.task('release', function () {
    return increaseVersion('major');
});

gulp.task('deploy', function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});
