module Components {
    var GameCardModule = angular.module('GameCardModule', []);

    GameCardModule.service('gameCardService', GameCardService);

    GameCardModule.component('gameCard', GameCard());
}