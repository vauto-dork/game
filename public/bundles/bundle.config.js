var bundleFiles = require('./bundle.files.json');

// Paths for file generation
var generatedFilePath = './' + bundleFiles.sourceRootFilePath + '/';

//-----------------------------------------------------------------------------
var getScriptsArray = function(scriptPathArray) {
  return scriptPathArray.map(function(element) {
    return generatedFilePath + element;
  });
};

//-----------------------------------------------------------------------------
var getScriptConfig = function(pageModuleName) {
  var scripts = bundleFiles.scripts[pageModuleName];

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