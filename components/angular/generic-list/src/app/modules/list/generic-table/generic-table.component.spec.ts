import { PagingComponent } from './../paging/paging.component';
import { ListSearchComponent } from './../list-search/list-search.component';
import { ListFilterComponent } from './../list-filter/list-filter.component';
import { ListModule } from './../list.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableComponent } from './generic-table.component';
import { PlainTableComponent } from '../plain-table/plain-table.component';

describe('GenericTableComponent', () => {
  let component: GenericTableComponent;
  let fixture: ComponentFixture<GenericTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTableComponent, ListFilterComponent, ListSearchComponent, PagingComponent, PlainTableComponent ],
      imports: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
