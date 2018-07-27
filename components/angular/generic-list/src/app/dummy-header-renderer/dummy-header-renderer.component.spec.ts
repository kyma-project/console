import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyHeaderRendererComponent } from './dummy-header-renderer.component';

describe('DummyHeaderRendererComponent', () => {
  let component: DummyHeaderRendererComponent;
  let fixture: ComponentFixture<DummyHeaderRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummyHeaderRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
