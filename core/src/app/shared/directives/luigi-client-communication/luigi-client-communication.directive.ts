import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as luigiClient from '@kyma-project/luigi-client';

@Directive({
  selector: '[luigiClientCommunication]'
})
export class LuigiClientCommunicationDirective implements OnChanges {
  @Input() isActive: boolean;

  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isActive && !changes.isActive.firstChange) {
      if (changes.isActive.currentValue) {
        luigiClient.uxManager().addBackdrop();
      } else {
        luigiClient.uxManager().removeBackdrop();
      }
    }
  }
}
