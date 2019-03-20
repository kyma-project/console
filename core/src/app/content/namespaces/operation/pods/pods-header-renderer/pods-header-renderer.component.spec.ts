import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PodsHeaderRendererComponent } from './pods-header-renderer.component';

describe('PodsHeaderRendererComponent', () => {
  let component: PodsHeaderRendererComponent;
  let fixture: ComponentFixture<PodsHeaderRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PodsHeaderRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodsHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
