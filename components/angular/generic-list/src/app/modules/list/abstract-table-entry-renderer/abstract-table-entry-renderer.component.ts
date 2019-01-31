import { Component, Input, Injector } from '@angular/core';

@Component({
  template: '',
})
export class AbstractTableEntryRendererComponent {
  @Input() entry: any;
  @Input() entryEventHandler: any;
  protected action: any[] = [];
  constructor(protected injector: Injector) {
    this.entry = this.injector.get<any>('entry' as any);
    this.entryEventHandler = this.injector.get<any>('entryEventHandler' as any);
  }
}
