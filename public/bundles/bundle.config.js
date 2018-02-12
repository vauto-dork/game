var bundleHelper = require('./bundle.helper.js');

//-----------------------------------------------------------------------------
// Scripts must be listed in the order it should be concatenated.
module.exports = {
  bundle: {
    shared: bundleHelper.getScriptConfig('shared'),
    activeGames: bundleHelper.getScriptConfig('activeGames'),
    addPlayer: bundleHelper.getScriptConfig('addPlayer'),
    admin: bundleHelper.getScriptConfig('admin'),
    createGame: bundleHelper.getScriptConfig('createGame'),
    dorkOfTheYear: bundleHelper.getScriptConfig('dorkOfTheYear'),
    editGame: bundleHelper.getScriptConfig('editGame'),
    gameHistory: bundleHelper.getScriptConfig('gameHistory'),
    index: bundleHelper.getScriptConfig('index'),
    playersList: bundleHelper.getScriptConfig('playersList'),
    playerStats: bundleHelper.getScriptConfig('playerStats'),
    rankingHistory: bundleHelper.getScriptConfig('rankingHistory')
  }
};