import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitRangeHeaderRendererComponent } from './limit-range-header-renderer.component';

describe('LimitRangeHeaderRendererComponent', () => {
  let component: LimitRangeHeaderRendererComponent;
  let fixture: ComponentFixture<LimitRangeHeaderRendererComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [LimitRangeHeaderRendererComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitRangeHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
