import {
  Directive,
  ElementRef,
  Input,
  SimpleChanges,
  HostListener,
  Renderer2,
  OnChanges,
} from '@angular/core';

@Directive({
  selector: '[appAriaDisabled]',
})
export class AriaDisabledDirective implements OnChanges {
  constructor(private _elRef: ElementRef, private _renderer: Renderer2) {}
  @Input('appAriaDisabled') isDisabled: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDisabled) {
      this._renderer.setAttribute(
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
