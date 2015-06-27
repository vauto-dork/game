var AddPlayerDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/directives/AddPlayerTemplate.html',
		controller: 'AddPlayerController',
		controllerAs: 'ctrl',
		bindToController: true
	};
};

var AddPlayerController = function ($scope, $timeout, $http) {
	var me = this;
	me.success = false;
	me.failure = false;
	me.disableControls = false;
	
	me.State = {
		Ready: 0,
		Saving: 1,
		Saved: 2,
		Fail: 3
	};
	
	me.changeState = function(newState) {
		me.success = newState === me.State.Saved;
		me.failure = newState === me.State.Fail;
		me.disableControls = newState === me.State.Saving;
		
		switch(newState) {
			case me.State.Ready:
				me.resetForm();
				break;
			case me.State.Saving:
				me.savePlayer();
				break;
			case me.State.Saved:
				me.resetForm();
				$timeout(function(){
					me.changeState(me.State.Ready);
				}, 5000);
				break;				
		}
	};
	
	me.resetForm = function() {
		me.firstName = '';
		me.lastName = '';
		me.nickname = '';
	};
	
	me.savePlayer = function() {
		$http.post('/players', { firstName: me.firstName, lastName: me.lastName, nickname: me.nickname })
			.success(function (data, status, headers, config) {
				me.changeState(me.State.Saved);
			}).error(function (data, status, headers, config) {
				me.changeState(me.State.Fail);
				console.error(data);
		});
	};
	
	me.reset = function () {
		me.changeState(me.State.Ready);
	};
	
	me.submit = function(){
		me.changeState(me.State.Saving);
	};
	
	me.changeState(me.State.Ready);
};

AddPlayerController.$inject = ['$scope', '$timeout', '$http'];

DorkModule.controller('AddPlayerController', AddPlayerController);
DorkModule.directive('addPlayer', AddPlayerDirective);