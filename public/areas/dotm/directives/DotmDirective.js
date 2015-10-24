var DotmDirective = function() {
	return {
		scope: {
			month: "=",
			year: "="
		},
		templateUrl: '/areas/dotm/directives/DotmTemplate.html',
		controller: 'DotmController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var DotmController = function ($scope, $http) {
	var me = this;
	me.showDorks = false;
	me.hasUberdorks = false;
	me.hasNegadorks = false;
	me.uberdorkHeading = 'Uberdork';
	me.negadorkHeading = 'Negadork';
	
	me.getDotm = function() {
		var query = '?month=' + me.month + '&year=' + me.year;
		
		$http.get("/Players/dotm" + query).success(function(data, status, headers, config) {
		    me.loaded(data);
		}).
		error(function(data, status, headers, config) {
		    debugger;
		});
	};
	
	me.loaded = function(data) {
	    me.dotm = data;
		me.hasUberdorks = data.uberdorks.length > 0;
		// Let's not show negadorks because it's not nice.
		//me.hasNegadorks = data.negadorks.length > 0;
		me.showDorks = true;
	}
	
	$scope.$watchGroup([function(){ return me.month; }, function(){ return me.year; }], function(newValue, oldValue){
		if(newValue != oldValue) {
			me.getDotm();
		}
	});
	
	me.getDotm();
}

DotmController.$inject = ['$scope', '$http'];
