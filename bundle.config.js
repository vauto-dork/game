var bundleFiles = require('./public/bundles/bundleFiles.json');

// Paths for file generation
var generatedFilePath = './' + bundleFiles.sourceRootFilePath + '/';
var pageModuleFilePath = './' + bundleFiles.sourceRootFilePath + '/bundles/pageModules/';

//-----------------------------------------------------------------------------
var getScriptsArray = function(scriptPathArray, pageModuleFile) {
  var scriptsArray = [];

  scriptPathArray.forEach(function(element) {
    scriptsArray.push(generatedFilePath + element);
  });

  if(pageModuleFile) {
    scriptsArray.push(pageModuleFilePath + pageModuleFile);
  }

  return scriptsArray;
};

//-----------------------------------------------------------------------------
var getScriptConfig = function(pageModuleName) {
  var pageModuleFile = !bundleFiles.hasPageModule[pageModuleName] ? null : (pageModuleName + '.js');
  var scripts = bundleFiles.scripts[pageModuleName];

  return {
    scripts: getScriptsArray(scripts, pageModuleFile),
    options: {
      useMin: false,
      uglify: false,
      rev: false
    }
  };
};

//-----------------------------------------------------------------------------
// Scripts must be listed in the order it should be concatenated.
module.exports = {
  bundle: {
    shared: getScriptConfig('shared'),
    activeGames: getScriptConfig('activeGames'),
    addPlayer: getScriptConfig('addPlayer'),
    admin: getScriptConfig('admin'),
    createGame: getScriptConfig('createGame'),
    editActiveGame: getScriptConfig('editActiveGame'),
    gameHistory: getScriptConfig('gameHistory'),
    index: getScriptConfig('index'),
    playersList: getScriptConfig('playersList'),
    rankingHistory: getScriptConfig('rankingHistory')
  }
};