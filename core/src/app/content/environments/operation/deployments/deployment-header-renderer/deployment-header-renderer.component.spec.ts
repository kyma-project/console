import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as LuigiClient from '@kyma-project/luigi-client';
import { DeploymentHeaderRendererComponent } from './deployment-header-renderer.component';
import { LuigiClientService } from 'shared/services/luigi-client.service';

const mockLuigiClient = {
  getEventData: () => {
    return {
      isSystemNamespace: true
    };
  }
};

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
    spyOn(LuigiClient, 'getEventData').and.callFake(
      mockLuigiClient.getEventData
    );
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
