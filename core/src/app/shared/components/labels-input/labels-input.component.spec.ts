import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsInputComponent } from './labels.component';

describe('LabelsInputComponent', () => {
  let component: LabelsInputComponent;
  let fixture: ComponentFixture<LabelsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelsInputComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
