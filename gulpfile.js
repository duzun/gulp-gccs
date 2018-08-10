/**
 * A gulp file just to make sure the plugin is working.
 *
 * This file can also serve as an example.
 *
 * Targets gulp@4
 */

const gulp   = require('gulp');
const rename = require('gulp-rename');
const gccs   = require('./index');

gulp.task('es5', () =>
    gulp.src('index.js')
        .pipe(gccs({
            compilation_level: 'WHITESPACE_ONLY',
            formatting: 'pretty_print',
        }))
        .pipe(gulp.dest('dist/'))
);

gulp.task('min', () =>
    gulp.src(['dist/*.js', '!dist/*.min.js'], { base: 'dist' })
        .pipe(gccs())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('dist/'))
);

gulp.task('default', gulp.series('es5', 'min'));
