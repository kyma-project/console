import { ListModule } from './../list.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainTableComponent } from './plain-table.component';

describe('PlainTableComponent', () => {
  let component: PlainTableComponent;
  let fixture: ComponentFixture<PlainTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlainTableComponent],
    })
      .overrideTemplate(PlainTableComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
