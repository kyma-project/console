import { ListModule } from './../list.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSearchComponent } from './list-search.component';

describe('ListSearchComponent', () => {
  let component: ListSearchComponent;
  let fixture: ComponentFixture<ListSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
