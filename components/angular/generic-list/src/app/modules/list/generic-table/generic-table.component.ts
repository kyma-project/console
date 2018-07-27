import { Component, Input, Type } from '@angular/core';
import { GenericListComponent } from '../generic-list/generic-list.component';

@Component({
  selector: 'y-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: [
    './generic-table.component.scss'
  ]
})
export class GenericTableComponent extends GenericListComponent {
  @Input() headerRenderer: Type<any>;
  @Input() footerRenderer: Type<any>;
}
