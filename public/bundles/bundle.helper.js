var bundleFiles = require('./bundle.files.json');

// Paths for file generation
var generatedFilePath = './' + bundleFiles.sourceRootFilePath + '/';

//-----------------------------------------------------------------------------
var getScriptsArray = function (scriptPathArray) {
    return scriptPathArray.map(function (element) {
        return generatedFilePath + element;
    });
};

var squashScriptFiles = function(pageModuleName) {
    var scripts = bundleFiles.scripts[pageModuleName].files;
    var components = bundleFiles.scripts[pageModuleName].components;

    if (components) {
        var newList;
        for (var i = 0; i < components.length; i++) {
            if (i === 0) {
                newList = bundleFiles.components[components[i]];
            } else {
                newList.concat(bundleFiles.components[components[i]]);
            }
        }
        scripts = !newList ? scripts : newList.concat(scripts);
    }

    return scripts;
}

//-----------------------------------------------------------------------------
var getScriptConfig = function (pageModuleName) {
    var scripts = squashScriptFiles(pageModuleName);

    return {
        scripts: getScriptsArray(scripts),
        options: {
            useMin: false,
            uglify: false,
            rev: false
        }
    };
};

module.exports = {
    bundleFiles: bundleFiles,
    squashScriptFiles: squashScriptFiles,
    getScriptConfig: getScriptConfig
}