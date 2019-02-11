import { PagingComponent } from './../paging/paging.component';
import { ListSearchComponent } from './../list-search/list-search.component';
import { ListFilterComponent } from './../list-filter/list-filter.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GenericTableComponent } from './generic-table.component';
import { PlainTableComponent } from '../plain-table/plain-table.component';

describe('GenericTableComponent', () => {
  let component: GenericTableComponent;
  let fixture: ComponentFixture<GenericTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GenericTableComponent,
        ListFilterComponent,
        ListSearchComponent,
        PagingComponent,
        PlainTableComponent,
      ],
      imports: [],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
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
