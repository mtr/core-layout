import gulp from 'gulp';
import bump from 'gulp-bump';
import filter from 'gulp-filter';
import ghPages from 'gulp-gh-pages';
import git from 'gulp-git';
import tag_version from 'gulp-tag-version';

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
