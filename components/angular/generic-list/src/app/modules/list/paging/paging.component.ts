import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'y-list-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
})
export class PagingComponent {
  @Input() pagingState;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onPageChanged = new EventEmitter();

  goToPage(pageNumber) {
    this.pagingState.pageNumber = pageNumber;
    this.onPageChanged.emit(this.pagingState);
  }
}
