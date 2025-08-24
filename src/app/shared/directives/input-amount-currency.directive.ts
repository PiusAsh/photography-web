import { Directive, ElementRef, HostListener, Renderer2, forwardRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
    selector: '[formatInputAmount]',
    standalone: false,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumberFormatDirective),
            multi: true
        }
    ]
})
export class NumberFormatDirective implements ControlValueAccessor {
    private rawValue: string = '';

    @Output() amountChange = new EventEmitter<any>(); 

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('input', ['$event'])
    onInput(event: any) {
        let value = event.target.value.replace(/,/g, '');

        // Allow only valid decimal numbers with up to 2 decimal places (including partial input)
        // Explanation:
        // ^\d*       -> start with zero or more digits
        // (\.\d{0,2})? -> optional decimal point followed by 0 to 2 digits
        // $          -> end of string
        if (!/^\d*(\.\d{0,2})?$/.test(value)) {
            value = this.rawValue; // invalid input, revert
        } else {
            this.rawValue = value;
        }

        this.updateDisplay(this.rawValue);
        this.onChange(this.rawValue);
        this.amountChange.emit(this.rawValue); // Emit string
    }

    @HostListener('blur')
    onBlur() {
        if (this.rawValue) {
            // On blur, format the number properly with commas and exactly 2 decimals
            let numberValue = parseFloat(this.rawValue);
            if (!isNaN(numberValue)) {
                // Fix to 2 decimals and convert back to string
                this.rawValue = numberValue.toFixed(2);
                this.updateDisplay(this.rawValue);
                this.onChange(this.rawValue);
                this.amountChange.emit(this.rawValue);
            }
        }
    }

    @HostListener('focus')
    onFocus() {
        this.renderer.setProperty(this.el.nativeElement, 'value', this.rawValue);
    }

    writeValue(value: any): void {
        if (value !== null && value !== undefined) {
            this.rawValue = value.toString();
            this.updateDisplay(this.rawValue);
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void { }

    private onChange = (value: any) => { };

    private updateDisplay(value: string) {
        // Format with commas only if no trailing decimal point (to avoid confusing user)
        const formattedValue =
            value && !value.endsWith('.') ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value;
        this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
    }
}