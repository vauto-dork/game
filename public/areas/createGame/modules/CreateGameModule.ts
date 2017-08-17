module CreateGame {
    var CreateGameModule = angular.module('CreateGameModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);
    
    CreateGameModule.service('createGameService', CreateGameService);
    
    CreateGameModule.component('buttonsPanel', ButtonsPanel());
    CreateGameModule.component('selectedPlayers', SelectedPlayers());
    CreateGameModule.component('createGame', CreateGame());
}