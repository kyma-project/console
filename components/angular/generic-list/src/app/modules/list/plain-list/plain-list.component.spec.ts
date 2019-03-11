import { ListModule } from './../list.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainListComponent } from './plain-list.component';

describe('PlainListComponent', () => {
  let component: PlainListComponent;
  let fixture: ComponentFixture<PlainListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlainListComponent],
    })
      .overrideTemplate(PlainListComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
