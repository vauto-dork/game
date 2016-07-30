var gulp = require('gulp'),
  bundle = require('gulp-bundle-assets');
 
 /*
  gulp-bundle-assets repo:
  https://github.com/dowjones/gulp-bundle-assets
 
 	The documentation for the gulp plugin is shit. It's not
 	organized very well and doesn't touch all the params.
  It's best to just find what you want to do in the full
  example.
*/

gulp.task('bundle', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(bundle.results({
      pathPrefix: '/bundles/'
    })) // arg is destination of bundle.result.json
    .pipe(gulp.dest('./public/bundles'));
});