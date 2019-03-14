import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExposeApiComponent } from './expose-api.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentEnvironmentService } from '../../../../services/current-namespace.service';
import { ExposeApiService } from './expose-api.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IdpPresetsService } from '../../../../../settings/idp-presets/idp-presets.service';
import { AppConfig } from '../../../../../../app.config';
import { ModalService } from 'fundamental-ngx';

describe('ExposeApiComponent', () => {
  let component: ExposeApiComponent;
  let fixture: ComponentFixture<ExposeApiComponent>;
  let fetchServiceSpy;
  let fetchApiDefinitionSpy;
  let fetchListOfServicesSpy;

  const ActivatedRouteMock = {
    params: of({ apiName: 'name' })
  };

  const IdpPresetsMockService = {
    getDefaultIdpPreset: () => {
      return of({
        issuer: 'https://someauthissuerurl',
        jwks_uri: 'https://someauthissuerurl/keys'
      });
    },
    getIDPPresets: () => {
      return of([]);
    }
  };

  const ExposeApiServiceMock = {
    getApiDefinition: () => {
      return of({
        spec: {
          hostname: 'bla',
          service: {
            port: '999'
          },
          authentication: {}
        }
      });
    },
    getPodsByLabelSelector: () => {
      return of({
        items: [
          {
            kind: 'Pod',
            spec: {
              containers: [
                {
                  name: 'istio-proxy'
                }
              ]
            }
          }
        ]
      });
    }
  };

  const RouterMock = {
    navigate() {
      return Promise.resolve(true);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExposeApiComponent],
      imports: [FormsModule, RouterModule],
      providers: [
        CurrentEnvironmentService,
        { provide: ExposeApiService, useValue: ExposeApiServiceMock },
        HttpClient,
        HttpHandler,
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: Router, useValue: RouterMock },
        { provide: IdpPresetsService, useValue: IdpPresetsMockService },
        {
          provide: ModalService,
          useValue: {}
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideTemplate(ExposeApiComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExposeApiComponent);
    component = fixture.componentInstance;
    fetchServiceSpy = spyOn(component, 'fetchService');
    fetchApiDefinitionSpy = spyOn(component, 'fetchApiDefinition');
    fetchListOfServicesSpy = spyOn(component, 'fetchListOfServices');
    fixture.detectChanges();
    component.routedFromServiceDetails = true;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch api definition if its an existing api', () => {
      fetchServiceSpy.calls.reset();
      fetchApiDefinitionSpy.calls.reset();
      fetchListOfServicesSpy.calls.reset();
      component.ngOnInit();
      expect(component.apiName).toEqual('name');
      expect(component.fetchApiDefinition).toHaveBeenCalledTimes(1);
      expect(component.fetchService).not.toHaveBeenCalled();
      expect(component.fetchListOfServices).not.toHaveBeenCalled();
      expect(component.routedFromServiceDetails).toEqual(false);
    });

    it('should fetch api definition if its an existing api with specified service', async () => {
      fetchServiceSpy.calls.reset();
      fetchApiDefinitionSpy.calls.reset();
      fetchListOfServicesSpy.calls.reset();
      const route = TestBed.get(ActivatedRoute);
      route.params = of({
        apiName: 'name',
        name: 'serviceName'
      });
      component.ngOnInit();
      expect(component.apiName).toEqual('name');
      expect(component.fetchApiDefinition).toHaveBeenCalledTimes(1);
      expect(component.fetchService).not.toHaveBeenCalled();
      expect(component.fetchListOfServices).not.toHaveBeenCalled();
      expect(component.routedFromServiceDetails).toEqual(true);
    });

    it('should fetch a service if its a new api for specific service', async () => {
      fetchServiceSpy.calls.reset();
      fetchApiDefinitionSpy.calls.reset();
      fetchListOfServicesSpy.calls.reset();
      const route = TestBed.get(ActivatedRoute);
      route.params = of({ name: 'name' });
      component.ngOnInit();
      expect(component.serviceName).toEqual('name');
      expect(component.fetchService).toHaveBeenCalledTimes(1);
      expect(component.fetchApiDefinition).not.toHaveBeenCalled();
      expect(component.fetchListOfServices).not.toHaveBeenCalled();
      expect(component.routedFromServiceDetails).toEqual(true);
    });

    it('should fetch services list if its a new api without specified service', async () => {
      fetchServiceSpy.calls.reset();
      fetchApiDefinitionSpy.calls.reset();
      fetchListOfServicesSpy.calls.reset();
      const route = TestBed.get(ActivatedRoute);
      route.params = of({ randomParam: '' });
      component.ngOnInit();
      expect(component.fetchListOfServices).toHaveBeenCalledTimes(1);
      expect(component.fetchApiDefinition).not.toHaveBeenCalled();
      expect(component.fetchService).not.toHaveBeenCalled();
      expect(component.routedFromServiceDetails).toEqual(false);
    });
  });

  describe('setData', () => {
    const domain = AppConfig.domain;

    const apiDefinition = {
      spec: {
        hostname: `hostName.${domain}`,
        service: {
          name: 'serviceName',
          port: '999'
        },
        authentication: {}
      }
    };

    const apiDefinitionWithAuth = {
      spec: {
        hostname: `hostName.${domain}`,
        service: {
          name: 'serviceName',
          port: '999'
        },
        authentication: [
          {
            jwt: {
              jwksUri: 'dexUri',
              issuer: 'dex'
            }
          }
        ]
      }
    };

    it("should set data without securing it if api definition doesn't have authentication", () => {
      fetchServiceSpy.calls.reset();
      component.setData(apiDefinition);
      expect(component.apiDefinition).toEqual(apiDefinition);
      expect(component.serviceName).toEqual(apiDefinition.spec.service.name);
      expect(component.hostname).toEqual('hostName');
      expect(component.servicePort).toEqual(apiDefinition.spec.service.port);
      expect(component.secure).toEqual(false);
      expect(typeof component.jwksUri).toEqual('undefined');
      expect(typeof component.issuer).toEqual('undefined');
      expect(component.fetchService).toHaveBeenCalledTimes(1);
    });

    it('should set data and securing it if api definition has authentication', () => {
      fetchServiceSpy.calls.reset();
      component.setData(apiDefinitionWithAuth);
      expect(component.apiDefinition).toEqual(apiDefinitionWithAuth);
      expect(component.serviceName).toEqual(
        apiDefinitionWithAuth.spec.service.name
      );
      expect(component.hostname).toEqual('hostName');
      expect(component.servicePort).toEqual(
        apiDefinitionWithAuth.spec.service.port
      );
      expect(component.secure).toEqual(true);
      expect(component.jwksUri).toEqual('dexUri');
      expect(component.issuer).toEqual('dex');
      expect(component.fetchService).toHaveBeenCalledTimes(1);
    });
  });

  describe('checkIfServiceExists', () => {
    it('should return true if the name matches one of the names in the services list', () => {
      const listOfServices = [
        {
          metadata: {
            name: 'serviceName'
          }
        },
        {
          metadata: {
            name: 'serviceName2'
          }
        }
      ];
      component.listOfServices = listOfServices;
      component.serviceName = 'serviceName';
      const res = component.checkIfServiceExists();
      expect(res).toEqual(true);
    });

    it("should return false if the name doesn't match one of the names in the services list", () => {
      const listOfServices = [
        {
          metadata: {
            name: 'serviceName'
          }
        },
        {
          metadata: {
            name: 'serviceName2'
          }
        }
      ];
      component.listOfServices = listOfServices;
      component.serviceName = 'differentName';
      const res = component.checkIfServiceExists();
      expect(res).toEqual(false);
    });
  });

  describe('setApiName', () => {
    it('should set a proper api name if service and host names are provided', () => {
      component.serviceName = 'serviceName';
      component.hostname = 'hostName';
      component.setApiName();
      expect(component.apiName).toEqual('serviceName-hostName');
    });
  });

  describe('Secure API', () => {
    it('should not request securing API if service can be secured', () => {
      component.secure = true;
      component.canBeSecured = true;
      const dataToSend = component.dataToSend();
      expect(dataToSend.authentication).toBeDefined();
      expect(dataToSend.authentication.length === 1).toBeTruthy();
    });

    it('should not request securing API if service cannot be secured', () => {
      component.secure = true;
      expect(component.canBeSecured).toEqual(false);
      const dataToSend = component.dataToSend();
      expect(dataToSend.authentication).toBeNull();
    });

    it('should let the user create secure api, if matching pods contain istio-proxy container', () => {
      component.checkIfServiceCanBeSecured({
        kind: 'Service',
        spec: {
          selector: {
            app: 'publish'
          }
        }
      });

      expect(component.canBeSecured).toBeTruthy();
    });
  });
});
