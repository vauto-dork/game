var GameCardModule = angular.module('GameCardModule', []);

GameCardModule.service('gameCardService', Components.GameCardService);

GameCardModule.controller('GameCardController', Components.GameCardController);
GameCardModule.directive('gameCard', Components.GameCardDirective);