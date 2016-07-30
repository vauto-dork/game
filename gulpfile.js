var gulp = require("gulp");
var sass = require('gulp-sass');
var ts = require("gulp-typescript");
var bundle = require("gulp-bundle-assets");

var tsProject = ts.createProject("tsconfig.json");

//-----------------------------------------------------------------------------
// Typescript configuration
// https://www.typescriptlang.org/docs/handbook/gulp.html
gulp.task("ts-compile", function () {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest("generated"));
});

//-----------------------------------------------------------------------------
// Sass configuration
// https://code.visualstudio.com/docs/languages/css#_transpiling-sass-and-less-into-css
gulp.task("sass-compile", function() {
    gulp.src("./scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./public/stylesheets"))
});

gulp.task("sass-watch", ["sass-compile"], function() {
    gulp.watch("./scss/*.scss", ["sass-compile"]);
});

//-----------------------------------------------------------------------------
// Bundling configuration
// https://github.com/dowjones/gulp-bundle-assets
 /*
 	The documentation for this gulp plugin is shit. It's not
 	organized very well and doesn't touch all the params.
  
    It's best to just find what you want to do in the full
    example.
*/

gulp.task("bundle", ["ts-compile"], function() {
  return gulp.src("./bundle.config.js")
    .pipe(bundle())
    .pipe(bundle.results({
      pathPrefix: "/bundles/"
    })) // arg is destination of bundle.result.json
    .pipe(gulp.dest("./public/bundles"));
});

gulp.task("bundle-watch", ["bundle"], function() {
    gulp.watch("*.ts", ["bundle"]);
});

//-----------------------------------------------------------------------------
// Main tasks
// https://github.com/gulpjs/gulp/blob/master/docs/API.md

/*
    Watches all Sass and Typescript files for transpiling and bundling

	You want to run this one in the background with the command
	"$ gulp transpile-watch"
*/
gulp.task("transpile-watch", ["sass-watch", "bundle-watch"]);

/*
    Default build task that transpiles and bundles files.

    Hook this up to the Visual Studio build task or run with the command
    "$ gulp build"
*/
gulp.task("build", ["sass-compile", "bundle"]);