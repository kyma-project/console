import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentHeaderRendererComponent } from './deployment-header-renderer.component';
import { LuigiClientService } from 'shared/services/luigi-client.service';

describe('DeploymentHeaderRendererComponent', () => {
  let component: DeploymentHeaderRendererComponent;
  let fixture: ComponentFixture<DeploymentHeaderRendererComponent>;
  let luigiClientService: LuigiClientService;

  beforeEach(async(() => {
    const mockLuigiClientService = {
      hasBackendModule: () => true
    };

    TestBed.configureTestingModule({
      declarations: [DeploymentHeaderRendererComponent],
      providers: [
        { provide: LuigiClientService, useValue: mockLuigiClientService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentHeaderRendererComponent);
    component = fixture.componentInstance;
    luigiClientService = TestBed.get(LuigiClientService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("set 'showBoundService' value on component init", () => {
    expect(this.showBoundServices).toBeUndefined();
    spyOn(luigiClientService, 'hasBackendModule').and.returnValue(true);
    fixture.detectChanges();
    expect(luigiClientService.hasBackendModule).toHaveBeenCalledWith(
      'servicecatalogaddons'
    );
    expect(component.showBoundServices).toBe(true);
  });
});
