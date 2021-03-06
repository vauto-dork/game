module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;

    export function DeltaBox(): ng.IComponentOptions {
        return {
			bindings: {
                value: "=",
                decimal: "@",
                diff: "=",
                isPercent: "="
			},
			templateUrl: "/areas/playerStats/directives/DeltaBoxTemplate.html",
			controller: DeltaBoxController
        };
    }

    export class DeltaBoxController {
        public static $inject: string[] = [];

        private value: number;
        private decimal: number;
        private diff: number;
        private isPercent: boolean;

        private get hasNoValue(): boolean {
            return this.value === null || this.value === undefined;
        }

        private get hasValue(): boolean {
            return (this.value === 0) || !!this.value;
        }

        private get isDiffPositive(): boolean {
            return this.diff > 0;
        }

        private get isDiffNegative(): boolean {
            return this.diff < 0;
        }

        private get absDiff(): number {
            return Math.abs(this.diff);
        }

        private get absValue(): number {
            return Math.abs(this.value);
        }

        private get decimalPlaces(): number {
            return (this.isPercent && (this.diff >= 100 || this.diff <= -100)) ? 0 : this.decimal;
        }

        constructor() {
        }
    }
}