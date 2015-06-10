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

var AddPlayerController = function ($scope, $http) {
	var me = this;
	me.success = false;
	me.failure = false;
	
	this.reset = function () {
		me.firstName = '';
		me.lastName = '';
		me.nickname = '';
		me.success = false;
		me.failure = false;
	};
	
	this.submit = function(){
		me.success = false;
		me.failure = false;
		
		$http.post('/players', { firstName: me.firstName, lastName: me.lastName, nickname: me.nickname })
			.success(function (data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			me.firstName = '';
			me.lastName = '';
			me.nickname = '';
			me.success = true;
			}).error(function (data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			me.failure = true;
			debugger;
		});
	};
};

AddPlayerController.$inject = ['$scope', '$http'];

DorkModule.controller('AddPlayerController', AddPlayerController);
DorkModule.directive('addPlayer', AddPlayerDirective);