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
    }
  }
};