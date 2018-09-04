import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[stringReplace]'
})
export class ReplaceDirective implements AfterViewInit {
  // tslint:disable-next-line:no-input-rename
  @Input('stringReplace') stringReplace: string;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const inputs = this.stringReplace.split(':');
    let originalValue = this.el.nativeElement.innerHTML;
    originalValue = originalValue.replace(inputs[0], inputs[1]);
    this.el.nativeElement.innerHTML = originalValue;
  }
}
