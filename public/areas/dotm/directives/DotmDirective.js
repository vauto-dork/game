var DotmDirective = function() {
	return {
		scope: {
		},
		templateUrl: '/areas/dotm/directives/DotmTemplate.html',
		controller: 'DotmController',
		controllerAs: 'ctrl',
		bindToController: true
	};
}

var DotmController = function ($scope, $http, dateTimeFactory) {
	var me = this;
	me.showDorks = false;
	me.hasNegadorks = false;
	me.uberdorkHeading = 'Uberdork';
	me.negadorkHeading = 'Negadork';
	
	me.getDotm = function() {
		var lastMonth = dateTimeFactory.LastMonthValue();
		var year = dateTimeFactory.CurrentYear();
		var query = '?month=' + lastMonth + '&year=' + year;
		
		$http.get("/Players/dotm" + query).success(function(data, status, headers, config) {
		    me.loaded(data);
		}).
		error(function(data, status, headers, config) {
		    debugger;
		});
		
		// 
		// var data = {
		//   "uberdorks": [
		//     {
		//       "player": {
		//         "_id": "552496daafe18e0300b2bb19",
		//         "__v": 0,
		//         "nickname": "",
		//         "lastName": "Branding",
		//         "firstName": "Steve"
		//       },
		//       "totalPoints": 19,
		//       "gamesPlayed": 1,
		//       "rank": 1
		//     }
		//   ],
		//   "negadorks": [
		//     {
		//       "player": {
		//         "_id": "553fecfdb6bea203005c0da6",
		//         "__v": 0,
		//         "nickname": "",
		//         "lastName": "Moeller",
		//         "firstName": "Jeff"
		//       },
		//       "totalPoints": -1,
		//       "gamesPlayed": 5,
		//       "rank": 36
		//     }
		//   ]
		// };
		// me.loaded(data);
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
	
	me.getDotm();
}

DotmController.$inject = ['$scope', '$http', 'dateTimeFactory'];

DorkModule.controller('DotmController', DotmController);
DorkModule.directive('dotm', DotmDirective);