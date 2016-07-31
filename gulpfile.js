var gulp = require("gulp");
var sass = require("gulp-sass");
var shell = require('gulp-shell')
var bundle = require("gulp-bundle-assets");
var fs = require("fs");
var path = require("path");

var bundleFiles = require('./public/bundles/bundleFiles.json');

//-----------------------------------------------------------------------------
// Very fragile way of creating a debug scripts file because gulp plugins are terrible.

var createScriptString = function(filepath) {
    return "<script src='/" + filepath + "' type='text/javascript'></script>"
};

gulp.task("debug-bundle", function () {
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
                    var sourceDir = path.join(".", bundleFiles.sourceRootFilePath, dirStr);
                    
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

            if(bundleFiles.hasPageModule[key]){
                var pageModuleFilePath = path.join("bundles", "pageModules", key + ".js");
                scriptString += createScriptString(pageModuleFilePath);
            }
            
            output[key] = {"scripts": scriptString};
        }
    }

    fs.writeFileSync("bundle.debug.json", JSON.stringify(output, null, "  "));
});

//-----------------------------------------------------------------------------
// Typescript configuration
// https://www.typescriptlang.org/docs/handbook/gulp.html
gulp.task("ts-compile", shell.task("tsc"));

//-----------------------------------------------------------------------------
// Sass configuration
// https://code.visualstudio.com/docs/languages/css#_transpiling-sass-and-less-into-css
gulp.task("sass-compile", function() {
    var outputDir = path.join(".", bundleFiles.sourceRootFilePath, "stylesheets")
    gulp.src("./scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(outputDir))
});

gulp.task("sass-watch", ["sass-compile"], function() {
    gulp.watch("./scss/*.scss", ["sass-compile"]);
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

gulp.task("bundle", ["ts-compile", "debug-bundle"], function() {
    var outputDir = path.join(".", bundleFiles.sourceRootFilePath, "bundles", "scripts")
    return gulp.src("./bundle.config.js")
        .pipe(bundle())
        .pipe(bundle.results({
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
	"$ gulp transpile-watch"
*/
gulp.task("transpile-watch", ["sass-watch", "bundle-watch"]);

/*
    Default build task that transpiles and bundles files.

    Hook this up to the Visual Studio build task or run with the command
    "$ gulp build"
*/
gulp.task("build", ["sass-compile", "bundle"]);