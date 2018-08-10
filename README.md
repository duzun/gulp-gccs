# gulp-gccs [![Build Status](https://travis-ci.org/duzun/gulp-gccs.svg?branch=master)](https://travis-ci.org/duzun/gulp-gccs) [![npm version](https://badge.fury.io/js/gulp-gccs.svg)](https://badge.fury.io/js/gulp-gccs)

Gulp plugin to compile JS files using Google Closure Compiler Service.


## Install 

Install via [npm](https://www.npmjs.com/package/gulp-gccs)

```sh
npm i -D gulp-gccs
```


## Usage

Here is an example that should get you started:

```js
const gulp   = require('gulp');
const gccs   = require('gulp-gccs');
const rename = require('gulp-rename');

gulp.task('es5', function() {
    return gulp.src('src/*.js', { base: 'src/' })
        .pipe(gccs({
            compilation_level: 'WHITESPACE_ONLY',
            formatting: 'pretty_print',
        }))
        .pipe(gulp.dest('dist/'))
    ;
});

gulp.task('min', function() {
    return gulp.src(['dist/*.js', '!dist/*.min.js'], { base: 'dist/' })
        .pipe(gccs())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('dist/'))
    ;
});

gulp.task('default', gulp.series('es5', 'min'));

```
