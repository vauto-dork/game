var bundleFiles = require('./bundle.files.json');

// Paths for file generation
var generatedFilePath = './' + bundleFiles.sourceRootFilePath + '/';

//-----------------------------------------------------------------------------
var recursiveComponents = function(componentsList) {
    if(!componentsList) {
        return componentsList;
    }

    var newList;

    for(var i = 0; i < componentsList.length; i++) {
        var componentName = componentsList[i];
        var componentComponents = bundleFiles.components[componentName].components;
        var recursiveResults = recursiveComponents(componentComponents);
        
        if(recursiveResults) {
            if(!newList) {
                newList = recursiveResults;
            } else {
                for(var j = 0; j < recursiveResults.length; j++) {
                    var result = recursiveResults[j];
                    var indexFound = newList.indexOf(result);

                    if(indexFound === -1) {
                        newList.push(result);
                    }
                }
            }
        }
    }

    if(!newList) {
        newList = componentsList;
    } else {
        newList = [];
        for(var k = 0; k < componentsList.length; k++) {
            var result = componentsList[k];

            if(newList.indexOf(result) === -1) {
                newList.push(result);
            }
        }
    }

    return newList;
}

//-----------------------------------------------------------------------------
var squashScriptFiles = function(pageModuleName) {
    var scripts = bundleFiles.scripts[pageModuleName].files;
    var componentsList = bundleFiles.scripts[pageModuleName].components;
    var components = recursiveComponents(componentsList);

    if (components) {
        var newList;        
        for (var i = 0; i < components.length; i++) {
            var items = bundleFiles.components[components[i]].files;

            if (!newList) {
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

//-----------------------------------------------------------------------------
module.exports = {
    bundleFiles: bundleFiles,
    squashScriptFiles: squashScriptFiles,
    getScriptConfig: getScriptConfig
}