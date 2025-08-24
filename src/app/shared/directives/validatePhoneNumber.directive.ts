import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[ValidatePhoneNumber]',
  standalone: false,
})
export class ValidatePhoneNumberDirective {
  private maxLength: number = 13; // Set max length to 13 digits

  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const inputChar = event.key;
    const currentValue = this.el.nativeElement.value;

    // Allow only numbers (0-9)
    const isNumber = /^[0-9]$/.test(inputChar);

    // Prevent input if it's not a number or max length is exceeded
    if (!isNumber || currentValue.length >= this.maxLength) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';

    // Prevent paste if content is not numeric or exceeds max length
    if (
      !/^[0-9]*$/.test(pastedText) ||
      pastedText.length + this.el.nativeElement.value.length > this.maxLength
    ) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputValue = this.el.nativeElement.value;

    // Sanitize input: remove non-numeric characters and enforce max length
    const sanitizedValue = inputValue
      .replace(/[^0-9]/g, '')
      .slice(0, this.maxLength);
    if (sanitizedValue !== inputValue) {
      this.el.nativeElement.value = sanitizedValue;
    }
  }

  @HostListener('blur') // ✅ Removed ['$event'] here
  onBlur(): void {
    const inputValue = this.el.nativeElement.value;

    // Sanitize input on blur to ensure only numbers remain
    const sanitizedValue = inputValue
      .replace(/[^0-9]/g, '')
      .slice(0, this.maxLength);
    if (sanitizedValue !== inputValue) {
      this.el.nativeElement.value = sanitizedValue;
    }
  }
}
