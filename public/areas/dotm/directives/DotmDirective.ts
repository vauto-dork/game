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
        public static $inject: string[] = ['$scope', 'apiService'];
		private month: number;
		private year: number;

		private dotm: Shared.IDotmViewModel;
		private hasUberdorks: boolean = false;

        constructor(private $scope: ng.IScope, private apiService: Shared.IApiService) {
			this.getDotm();

			$scope.$watchGroup([() => this.month, () => this.year], (newValue, oldValue) => {
				if (newValue !== oldValue) {
					this.getDotm();
				}
			});
        }

		private getDotm() {
			this.hasUberdorks = false;
			this.apiService.getDotm(this.month, this.year).then((data: Shared.IDotmViewModel) => {
				this.dotm = data;
				this.hasUberdorks = data.uberdorks.length > 0;
			}, ()=>{
				console.error("Cannot get DOTM.");
			});
		}
    }
}

