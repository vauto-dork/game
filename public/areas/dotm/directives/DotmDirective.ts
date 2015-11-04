module Dotm {
    export function DotmDirective(): ng.IDirective {
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

    export class DotmController {
        public static $inject: string[] = ['$scope', '$http'];
		private month: number;
		private year: number;

		private dotm: any;
		private showDorks: boolean = false;
		private hasUberdorks: boolean = false;
		private hasNegadorks: boolean = false;
		private uberdorkHeading: string = 'Uberdork';
		private negadorkHeading: string = 'Negadork';

        constructor(private $scope: ng.IScope, private $http: ng.IHttpService) {
			this.getDotm();

			$scope.$watchGroup([() => this.month, () => this.year], (newValue, oldValue) => {
				if (newValue !== oldValue) {
					this.getDotm();
				}
			});
        }

		private getDotm() {
			var query: string = '?month=' + this.month + '&year=' + this.year;

			this.$http.get("/Players/dotm" + query)
				.success((data, status, headers, config) => {
					this.loaded(data);
				}).
				error((data, status, headers, config) => {
					debugger;
				});
		}

		private loaded(data) {
			this.dotm = data;
			this.hasUberdorks = data.uberdorks.length > 0;
			// Let's not show negadorks because it's not nice.
			//me.hasNegadorks = data.negadorks.length > 0;
			this.showDorks = true;
		}
    }
}

