import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat',
    standalone: false,
})
export class DateFormatPipe implements PipeTransform {
    constructor(private datePipe: DatePipe) { }

    transform(value: string | Date): string | null {
        if (!value) return null; // Handle null/undefined cases
        return this.datePipe.transform(value, 'dd-MMM-yyyy'); // Example: 10-Jun-1980
    }
}
