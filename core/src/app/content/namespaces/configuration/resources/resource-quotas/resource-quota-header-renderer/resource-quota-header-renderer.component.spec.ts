import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceQuotaHeaderRendererComponent } from './resource-quota-header-renderer.component';

describe('ResourceQuotasHeaderRendererComponent', () => {
  let component: ResourceQuotaHeaderRendererComponent;
  let fixture: ComponentFixture<ResourceQuotaHeaderRendererComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ResourceQuotaHeaderRendererComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceQuotaHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
