var AddPlayerDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/AddPlayerTemplate.html',
		controller: 'AddPlayerController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var AddPlayerController = function ($scope, $timeout, $http) {
	var me = this;
	me.success = false;
	me.failure = false;
	
	me.reset = function () {
		me.firstName = '';
		me.lastName = '';
		me.nickname = '';
		me.success = false;
		me.failure = false;
	};
	
	me.submit = function(){
		me.success = false;
		me.failure = false;
		
		$http.post('/players', { firstName: me.firstName, lastName: me.lastName, nickname: me.nickname })
			.success(function (data, status, headers, config) {
				me.firstName = '';
				me.lastName = '';
				me.nickname = '';
				me.success = true;
				
				$timeout(function(){
					me.success = false;
				}, 5000);
				
			}).error(function (data, status, headers, config) {
				me.failure = true;
				debugger;
		});
	};
};

AddPlayerController.$inject = ['$scope', '$timeout', '$http'];

DorkModule.controller('AddPlayerController', AddPlayerController);
DorkModule.directive('addPlayer', AddPlayerDirective);