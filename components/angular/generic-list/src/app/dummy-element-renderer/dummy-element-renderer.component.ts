import { AbstractTableEntryRendererComponent } from './../modules/list/list.module';
import { Component, OnInit, Input, Injector } from '@angular/core';

@Component({
  selector: 'app-dummy-element-renderer',
  templateUrl: './dummy-element-renderer.component.html',
  styleUrls : ['./dummy-element-renderer.component.scss']
})
export class DummyElementRendererComponent extends AbstractTableEntryRendererComponent {

   actions = [
    {
      function: 'doABC',
      name: 'ABC'
    },
    {
      function: 'doXYZ',
      name: 'XYZ'
    }
  ];

}
