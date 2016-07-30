// Paths for file generation
var generatedFilePath = './generated/';
var pageModuleFilePath = './public/bundles/pageModules/';

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
var dorkAppBundleOptions = {
  useMin: false,
  uglify: false,
  rev: false
};

//-----------------------------------------------------------------------------
// Scripts must be listed in the order it should be concatenated.
module.exports = {
  bundle: {
    shared: {
      scripts: 
        getScriptsArray([
          'shared/models/*.js',
          'shared/services/*.js',
          'shared/directives/*.js',
          'shared/modules/*.js'
        ], null),
      options: dorkAppBundleOptions
    },
    activeGames: {
      scripts: 
        getScriptsArray([
          'areas/activeGame/directives/ActiveGamesDirective.js'
        ], 'activeGames.js'),
      options: dorkAppBundleOptions
    },
    addPlayer: {
      scripts: 
        getScriptsArray([
          'areas/players/directives/PlayerFormDirective.js',
          'areas/players/directives/AddPlayerDirective.js'
        ], 'addPlayer.js'),
      options: dorkAppBundleOptions
    },
    admin: {
      scripts: getScriptsArray([], 'admin.js'),
      options: dorkAppBundleOptions
    },
    createGame: {
      scripts: getScriptsArray([
        'areas/createGame/services/CreateGameService.js',
        'areas/createGame/directives/ButtonsPanelDirective.js',
        'areas/createGame/directives/SelectedPlayersDirective.js',
        'areas/createGame/directives/CreateGameDirective.js'
      ], 'createGame.js'),
      options: dorkAppBundleOptions
    },
    editActiveGame: {
      scripts: 
        getScriptsArray([
          'areas/editActiveGame/services/EditActiveGameService.js',
          'areas/editActiveGame/directives/EditScoresDirective.js',
          'areas/editActiveGame/directives/ReorderPlayersDirective.js',
          'areas/editActiveGame/directives/ModifyPlayersDirective.js',
          'areas/editActiveGame/directives/RevertFinalizeDirective.js',
          'areas/editActiveGame/directives/EditActiveGameDirective.js'
        ], 'editActiveGame.js'),
      options: dorkAppBundleOptions
    },
    gameHistory: {
      scripts: getScriptsArray([
        'areas/history/directives/GameHistoryDirective.js'
      ], 'gameHistory.js'),
      options: dorkAppBundleOptions
    },
    index: {
      scripts: 
        getScriptsArray([
          'areas/dotm/directives/DotmDirective.js',
          'areas/dotm/modules/DotmModule.js',
          'areas/rankings/services/RankingsService.js',
          'areas/rankings/directives/RankingsCardDirective.js',
          'areas/rankings/directives/RankingsDirective.js',
          'areas/rankings/modules/RankingsModule.js',
          'areas/rankings/directives/LeaderboardDirective.js'
        ], 'index.js'),
      options: dorkAppBundleOptions
    },
    playersList: {
      scripts: getScriptsArray([
        '/areas/players/directives/PlayerFormDirective.js',
        '/areas/players/directives/PlayersListDirective.js'
      ], 'playersList.js'),
      options: dorkAppBundleOptions
    },
    rankingHistory: {
      scripts: getScriptsArray([
        'areas/dotm/directives/DotmDirective.js',
        'areas/dotm/modules/DotmModule.js',
        'areas/rankings/services/RankingsService.js',
        'areas/rankings/directives/RankingsCardDirective.js',
        'areas/rankings/directives/RankingsDirective.js',
        'areas/rankings/modules/RankingsModule.js',
        'areas/history/directives/RankingHistoryDirective.js',
      ], 'rankingHistory.js'),
      options: dorkAppBundleOptions
    }
  }
};