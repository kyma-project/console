import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import LuigiClient from '@kyma-project/luigi-client';

@Directive({
  selector: '[luigiClientCommunication]'
})
export class LuigiClientCommunicationDirective implements OnChanges {
  @Input() isActive: boolean;

  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isActive) {
      if (changes.isActive.currentValue) {
        LuigiClient.uxManager().addBackdrop();
      } else {
        LuigiClient.uxManager().removeBackdrop();
      }
    }
  }
}
