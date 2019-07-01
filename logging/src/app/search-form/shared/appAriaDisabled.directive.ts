import {
  Directive,
  ElementRef,
  Renderer,
  Input,
  SimpleChanges,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appAriaDisabled]',
})
class AriaDisabledDirective {
  constructor(private _elRef: ElementRef, private _renderer: Renderer) {}
  @Input('appAriaDisabled') isDisabled: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDisabled) {
      this._renderer.setElementAttribute(
        this._elRef.nativeElement,
        'aria-disabled',
        this.isDisabled.toString(),
      ); // set the directive input as 'aria-disabled' value 
    }
  }

  @HostListener('click', ['$event'])
  onClick(e) {
    if (this.isDisabled) {
      e.preventDefault(); // do NOT perform click event if element is disabled (behave like HTML 'disabled' attribute)
    }
  }
}

export default AriaDisabledDirective;
