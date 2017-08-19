module ActiveGame {
    var ActiveGameModule = angular.module('ActiveGameModule', ['UxControlsModule', 'GameCardModule']);
    
    ActiveGameModule.component('activeGames', ActiveGames());
}