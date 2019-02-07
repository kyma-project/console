import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericListComponent } from './generic-list/generic-list.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { ListFilterComponent } from './list-filter/list-filter.component';
import { ListSearchComponent } from './list-search/list-search.component';
import { PagingComponent } from './paging/paging.component';
import { PlainListComponent } from './plain-list/plain-list.component';
import { PlainTableComponent } from './plain-table/plain-table.component';
import { ListElementActionsComponent } from './list-element-actions/list-element-actions.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { AbstractTableEntryRendererComponent } from './abstract-table-entry-renderer/abstract-table-entry-renderer.component';
import { FundamentalNgxModule } from 'fundamental-ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClickOutsideModule,
    FundamentalNgxModule,
  ],
  declarations: [
    GenericListComponent,
    GenericTableComponent,
    ListFilterComponent,
    ListSearchComponent,
    PagingComponent,
    PlainListComponent,
    PlainTableComponent,
    ListElementActionsComponent,
    AbstractTableEntryRendererComponent,
  ],
  exports: [
    GenericListComponent,
    GenericTableComponent,
    ListFilterComponent,
    ListSearchComponent,
    PagingComponent,
    PlainListComponent,
    PlainTableComponent,
    ListElementActionsComponent,
  ],
})
export class ListModule {}
export { Filter } from './filter/Filter';
export { Facet } from './filter/Facet';
export { SimpleFacetMatcher } from './filter/simple-facet-matcher';
export { SimpleFilterMatcher } from './filter/simple-filter-matcher';
export { ArrayDataProvider } from './source/array-data-provider';
export { DataConverter } from './source/data-converter';
export { DataProviderResult } from './source/data-provider-result';
export { DataProvider } from './source/data-provider';
export {
  AbstractTableEntryRendererComponent,
} from './abstract-table-entry-renderer/abstract-table-entry-renderer.component';
export { GenericListComponent } from './generic-list/generic-list.component';
export { GenericTableComponent } from './generic-table/generic-table.component';
