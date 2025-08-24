import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencyFormat',
    standalone: false,
})
export class currencyFormatPipe implements PipeTransform {

  transform(value: number): string {
    const formattedValue = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'narrowSymbol', // Uses ₦ instead of NGN
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

    return formattedValue.replace(/\u00A0/, ''); // Remove non-breaking space
  }
}
