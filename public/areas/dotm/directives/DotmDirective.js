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
		me.hasNegadorks = data.negadorks.length > 0;
		me.createHeadings();
		me.showDorks = true;
	}
	
	me.createHeadings = function() {
		if(me.dotm) {
			if(me.dotm.uberdorks.length > 1) {
				me.uberdorkHeading = 'Uberdorks';
			}
			
			if(me.dotm.negadorks && me.dotm.negadorks.length > 1) {
				me.negadorkHeading = 'Negadorks';
			}
		}
	};
	
	$scope.$on('dotmUpdate', function(){
		me.getDotm();
	});
	
	me.getDotm();
}

DotmController.$inject = ['$scope', '$http'];

DorkModule.controller('DotmController', DotmController);
DorkModule.directive('dotm', DotmDirective);