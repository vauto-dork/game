module Components {
    var newPlayerModule = angular.module('NewPlayerPanelModule', ['PlayerFormModule']);

    newPlayerModule.service('newPlayerPanelService', NewPlayerPanelService);

    newPlayerModule.component('newPlayerButton', NewPlayerButton());
    newPlayerModule.component('newPlayerPanel', NewPlayerPanel());
}