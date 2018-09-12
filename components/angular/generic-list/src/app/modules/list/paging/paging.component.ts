import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from '@angular/core';
import { isNullOrUndefined } from 'util';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'y-list-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
})
export class PagingComponent implements OnInit, OnChanges {
  @Input() pagingState;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onPageChanged = new EventEmitter();

  showPaging = false;
  pageNumbers = [];

  constructor() {}

  ngOnInit() {}

  goToPage(pageNumber) {
    this.pagingState.pageNumber = pageNumber;
    this.onPageChanged.emit(this.pagingState);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === 'pagingState' && !isNullOrUndefined(this.pagingState)) {
        this.showPaging = false;
        this.pageNumbers = [];
        if (this.pagingState.totalCount && this.pagingState.pageSize) {
          const pageCount = Math.ceil(
            this.pagingState.totalCount / this.pagingState.pageSize,
          );
          for (let i = 1; i <= pageCount; i++) {
            this.pageNumbers.push(i);
          }
          if (pageCount > 1 || this.pagingState.pageNumber > 1) {
            this.showPaging = true;
          }
        }
      }
    }
  }
}
