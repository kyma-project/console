import { Component, Input, Injector } from '@angular/core';

@Component({
  selector: 'y-dummy-element-list-renderer',
  templateUrl: './dummy-element-list-renderer.component.html',
  styleUrls: ['./dummy-element-list-renderer.component.scss'],
})
export class DummyElementListRendererComponent {
  @Input() entry: any;
  constructor(protected injector: Injector) {
    this.entry = this.injector.get<any>('entry' as any);
  }
}
