// gulpfile.js 
var gulp = require('gulp'),
  bundle = require('gulp-bundle-assets');
 
gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results('./')) // arg is destination of bundle.result.json
    .pipe(gulp.dest('./public/bundles'));
});