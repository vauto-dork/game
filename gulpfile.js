var gulp = require("gulp");
var sass = require("gulp-sass");
var shell = require('gulp-shell')
var bundle = require("gulp-bundle-assets");
var fs = require("fs");

var bundleFiles = require('./public/bundles/bundle.files.json');
var bundlesFilePath = "./" + bundleFiles.sourceRootFilePath + "/bundles";

//-----------------------------------------------------------------------------
// Very fragile way of creating a debug scripts file because gulp plugins are terrible.

var createScriptString = function(filepath) {
    return "<script src='/" + filepath + "' type='text/javascript'></script>";
};

gulp.task("debug-bundle", ["ts-build"], function () {
    var files = bundleFiles.scripts;
    var output = {};

    for (var key in files) {
        if (files.hasOwnProperty(key)) {
            var scriptString = "";

            // For each throws an exception for some reason.
            for(var i=0; i<files[key].length; i++) {

                // This is terrible code and I feel terrible.
                var filepath = files[key][i];
                var starIndex = filepath.indexOf("*.js");

                if(starIndex > 0){
                    var dirStr = filepath.substring(0, starIndex);
                    var sourceDir = "./" + bundleFiles.sourceRootFilePath + "/" + dirStr;
                    
                    fs.readdirSync(sourceDir).filter(function(element) {
                        return element.indexOf(".js") > 0 && element.indexOf(".js.map") === -1;
                    }).map(function(element) {
                        return dirStr + element;
                    }).forEach(function(element) {
                        scriptString += createScriptString(element);
                    });
                }
                else {
                    scriptString += createScriptString(filepath);
                }
            }
            
            output[key] = {"scripts": scriptString};
        }
    }

    fs.writeFileSync(bundlesFilePath + "/bundle.debug.json", JSON.stringify(output, null, "  "));
});

//-----------------------------------------------------------------------------
// Typescript configuration
// https://www.typescriptlang.org/docs/handbook/gulp.html
gulp.task("ts-build", shell.task("tsc"));

//-----------------------------------------------------------------------------
// Sass configuration
// https://code.visualstudio.com/docs/languages/css#_transpiling-sass-and-less-into-css
gulp.task("sass-build", function() {
    var outputDir = "./" + bundleFiles.sourceRootFilePath + "/stylesheets";
    gulp.src("./scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(outputDir));
});

gulp.task("sass-watch", ["sass-build"], function() {
    gulp.watch("./scss/*.scss", ["sass-build"]);
});

//-----------------------------------------------------------------------------
// Bundling configuration
// https://github.com/dowjones/gulp-bundle-assets
 /*
 	The documentation for this gulp plugin is shit. It is not
 	organized very well and does not touch all the params.
  
    It is best to just find what you want to do in the full
    example.
*/

gulp.task("bundle", ["debug-bundle"], function() { 
    var outputDir = bundlesFilePath + "/scripts";
    return gulp.src(bundlesFilePath +"/bundle.config.js")
        .pipe(bundle())
        .pipe(bundle.results({
            dest: bundlesFilePath,
            pathPrefix: "/bundles/scripts/"
        })) // arg is destination of bundle.result.json
        .pipe(gulp.dest(outputDir));
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
	"$ gulp build-watch"
*/
gulp.task("build-watch", ["sass-watch", "bundle-watch"]);

/*
    Default build task that transpiles and bundles files.

    Hook this up to the Visual Studio build task or run with the command
    "$ gulp build"
*/
gulp.task("build", ["sass-build", "bundle"]);