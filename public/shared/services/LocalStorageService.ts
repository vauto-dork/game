module Shared {
    export interface ILocalStorageService {
        getStoredValue(key: string): string;
        getStoredBoolean(key: string): boolean;
        getStoredNumber(key: string): number;
        setStoredValue(key: string, value: string|number|boolean): void;
    }

    export enum LocalStorageKeys {
        PlayerStatsRatingView = "PlayerStatsRatingView"
    }

    export class LocalStorageService implements ILocalStorageService {
        public static $inject: string[] = ["$window"];

        constructor(private $window: ng.IWindowService) {
            
        }

        public getStoredValue(key: string): string {
            return this.$window.localStorage.getItem(key);
        }

        public getStoredBoolean(key: string): boolean {
            var value = this.getStoredValue(key);
            return !value ? false : value.toLowerCase() === "true";
        }

        public getStoredNumber(key: string): number {
            var value = this.getStoredValue(key);
            return !value ? null : parseFloat(value);
        }

        public setStoredValue(key: string, value: string|number|boolean): void {            
            this.$window.localStorage.setItem(key, value.toString());
        }
    }
}