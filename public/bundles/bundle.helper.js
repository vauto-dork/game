var bundleFiles = require('./bundle.files.json');

// Paths for file generation
var generatedFilePath = './' + bundleFiles.sourceRootFilePath + '/';

//-----------------------------------------------------------------------------
var squashScriptFiles = function(pageModuleName) {
    var scripts = bundleFiles.scripts[pageModuleName].files;
    var components = bundleFiles.scripts[pageModuleName].components;

    if (components) {
        var newList;        
        for (var i = 0; i < components.length; i++) {
            var items = bundleFiles.components[components[i]];

            if (i === 0) {
                newList = items;
            } else {
                // concat doesn't work here.
                // see: http://stackoverflow.com/questions/16679565/why-cant-i-concat-an-array-reference-in-javascript
                newList.push.apply(newList, items);
            }
        }
        scripts = !newList ? scripts : newList.concat(scripts);
    }

    return scripts;
}

//-----------------------------------------------------------------------------
var getScriptsArray = function (scriptPathArray) {
    return scriptPathArray.map(function (element) {
        return generatedFilePath + element;
    });
};

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