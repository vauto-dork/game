var AddPlayerDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/areas/players/directives/AddPlayerTemplate.html',
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
	
	me.player = {
		firstName: '',
		lastName: '',
		nickname: ''
	}
	
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
		me.player.firstName = '';
		me.player.lastName = '';
		me.player.nickname = '';
	};
	
	me.savePlayer = function() {
		$http.post('/players', me.player)
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
