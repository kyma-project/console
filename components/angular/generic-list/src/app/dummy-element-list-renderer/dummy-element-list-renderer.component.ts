import { Component, OnInit, Input, Injector } from '@angular/core';

@Component({
  selector: 'dummy-element-list-renderer',
  templateUrl: './dummy-element-list-renderer.component.html',
  styleUrls : ['./dummy-element-list-renderer.component.scss']
})
export class DummyElementListRendererComponent {

  @Input() entry: any;
  constructor(protected injector: Injector) {
    this.entry = this.injector.get('entry');
  }

}
