module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;

    export function DeltaBoxDirective(): ng.IDirective {
        return {
			scope: {
                value: "=",
                decimal: "@",
                diff: "="
			},
			templateUrl: "/areas/playerStats/directives/DeltaBoxTemplate.html",
			controller: "DeltaBoxController",
			controllerAs: "ctrl",
			bindToController: true
        };
    }

    export class DeltaBoxController {

        private value: number;
        private decimal: number;
        private diff: number;

        private get hasNoValue(): boolean {
            return this.value === null || this.value === undefined;
        }

        private get isPositive(): boolean {
            return this.diff > 0;
        }

        private get isNegative(): boolean {
            return this.diff < 0;
        }

        private get absDiff(): number {
            return Math.abs(this.diff);
        }

        constructor() {
        }
    }
}