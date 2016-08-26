var bundleFiles = require('./bundle.files.json');

// Paths for file generation
var generatedFilePath = './' + bundleFiles.sourceRootFilePath + '/';

//-----------------------------------------------------------------------------
var getComponent = function(componentName) {
    return bundleFiles.components[componentName];
}

//-----------------------------------------------------------------------------
var prepend = function(dest, source) {
    for(var i = 0; i < source.length; i++) {
        var item = source[i];
        var foundIndex = dest.indexOf(item); 
        if(foundIndex >= 0) {
            dest.splice(foundIndex, 1);
            dest.splice(0, 0, item);
        }
    }
}

//-----------------------------------------------------------------------------
var append = function(dest, source) {
    for(var i = 0; i < source.length; i++) {
        var item = source[i];
        var foundIndex = dest.indexOf(item); 
        if(foundIndex === -1) {
            dest.push(item);
        }
    }
}

//-----------------------------------------------------------------------------
var recursiveComponentSquash = function(scripts, componentsList) {
    if (componentsList) {
        for (var i = 0; i < componentsList.length; i++) {
            var componentName = componentsList[i];
            var componentFiles = getComponent(componentName).files;

            var recursiveResults = recursiveComponentSquash(scripts, getComponent(componentName).components);

            if(recursiveResults) {
                prepend(scripts, recursiveResults);
            }            

            if (i === 0) {
                newList = componentFiles;
            } else {
                // concat doesn't work here.
                // see: http://stackoverflow.com/questions/16679565/why-cant-i-concat-an-array-reference-in-javascript
                append(newList, componentFiles);
            }
        }
        scripts = !newList ? scripts : newList.concat(scripts);
    }

    return scripts;
}

//-----------------------------------------------------------------------------
var squashScriptFiles = function(pageModuleName) {
    var scripts = bundleFiles.scripts[pageModuleName].files;
    var components = bundleFiles.scripts[pageModuleName].components;

    return recursiveComponentSquash(scripts, components);
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