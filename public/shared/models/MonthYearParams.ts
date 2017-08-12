module Shared {
    export interface IMonthYearParams {
		month: number;
        year: number;

        getVisibleQueryString(): string;
        getPostQueryString(): string;
    }
    
    export class MonthYearParams implements IMonthYearParams {
        public month: number;
        public year: number;

        private currentDate: Date = new Date();

        constructor(month?: number, year?: number) {
            this.month = (month === null || month === undefined) ? this.currentDate.getMonth() : month;
            this.year = (year === null || year === undefined) ? this.currentDate.getFullYear() : year;
        }

        public getVisibleQueryString(): string {
            if(this.month === this.currentDate.getMonth() && this.year === this.currentDate.getFullYear())
                return '';

            var monthShortName = Months.ShortNames[this.month];

            return `#?month=${monthShortName}&year=${this.year}`;
        }

        public getPostQueryString(): string {
            if(this.month === this.currentDate.getMonth() && this.year === this.currentDate.getFullYear())
                return '';

            return `?month=${this.month}&year=${this.year}`;
        }
    }
}