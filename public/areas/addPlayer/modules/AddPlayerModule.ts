module AddPlayer {
    var AddPlayerModule = angular.module('AddPlayerModule', ['UxControlsModule', 'PlayerFormModule']);

    AddPlayerModule.component('addPlayer', AddPlayer());
}