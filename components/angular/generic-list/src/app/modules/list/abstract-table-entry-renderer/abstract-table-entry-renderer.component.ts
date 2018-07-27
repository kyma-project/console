import { Component, OnInit, Input, Injector } from '@angular/core';

@Component({
  template: ''
})
export class AbstractTableEntryRendererComponent {

  @Input() entry: any;
  @Input() entryEventHandler: any;
  protected action: Array<any> = [];
  constructor(protected injector: Injector) {
    this.entry = this.injector.get('entry');
    this.entryEventHandler = this.injector.get('entryEventHandler');
  }
}
