var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
	sass: ['./www/scss/*.scss', 'www/js/**/*.scss']
};

gulp.task('sass', function(done) {
	gulp.src('./www/scss/app.scss')
		.pipe(sass({
			'style': 'expanded'
		}))
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('./www/css/'))
		.pipe(minifyCss())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./www/css/'))
		.on('end', done);
});

gulp.task('watch', function() {
	gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['sass', 'watch']);
