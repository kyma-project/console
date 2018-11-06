/* tslint:disable:max-classes-per-file */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRoute,
  RouterModule,
  NavigationEnd
} from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, of, throwError } from 'rxjs';

import { ExternalViewComponent } from './external-view.component';
import { ExtensionsService } from '../services/extensions.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import {
  IMicroFrontend,
  MicroFrontend
} from '../../shared/datamodel/k8s/microfrontend';

describe('ExternalViewComponent', () => {
  let component: ExternalViewComponent;
  let fixture: ComponentFixture<ExternalViewComponent>;
  let extensionsService: ExtensionsService;
  let extAppViewRegistryService: ExtAppViewRegistryService;

  class OAuthMock {
    getIdToken() {
      return 'token';
    }
  }

  const frontend: IMicroFrontend = {
    metadata: {
      name: 'testId',
      uid: 'uid'
    },
    status: {
      phase: 'ok'
    },
    data: {
      data1: 'data'
    },
    type: 'type',
    spec: {
      navigationNodes: [
        {
          navigationPath: 'tets',
          viewUrl:
            'https://pl.wikipedia.org/wiki/Wikipedia:Strona_g%C5%82%C3%B3wna'
        }
      ]
    },
    isStatusOk() {
      return true;
    },
    getId() {
      return 'testId';
    },
    getUid() {
      return 'testUid';
    },
    getLabel() {
      return 'testLabel';
    },
    getLocation() {
      return 'testId';
    }
  };

  const ActivatedRouteMock = {
    snapshot: {
      data: { placement: 'environment' },
      children: [
        {
          params: { id: 'testId', pathSegment1: 'tets' },
          children: []
        }
      ]
    }
  };

  let rCallback;
  const RouterMock = {
    navigateByUrl() {
      return Promise.resolve(true);
    },
    events: {
      subscribe(callback) {
        rCallback = callback;
      }
    }
  };

  const testNavigationEvent = function() {
    rCallback(
      new NavigationEnd(1, '/home/environments/tets/extensions/tets', '')
    );
  };

  const ExtensionsServiceStub = {
    getExtensions() {
      return of([]);
    },
    getExternalExtensions() {
      return of([]);
    },
    isUsingSecureProtocol() {
      return true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule],
      declarations: [ExternalViewComponent],
      providers: [
        ExtensionsService,
        CurrentEnvironmentService,
        ExtAppViewRegistryService,
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: Router, useValue: RouterMock },
        { provide: OAuthService, useValue: new OAuthMock() },
        { provide: ExtensionsService, useValue: ExtensionsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalViewComponent);
    component = fixture.componentInstance;
    extensionsService = fixture.debugElement.injector.get(ExtensionsService);
    extAppViewRegistryService = fixture.debugElement.injector.get(
      ExtAppViewRegistryService
    );
  });

  it('should create', () => {
    spyOn(extensionsService, 'getExtensions').and.returnValue(
      of([new MicroFrontend(frontend)])
    );
    spyOn(extensionsService, 'getExternalExtensions').and.returnValue(of([]));

    testNavigationEvent();

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(extensionsService.getExtensions).toHaveBeenCalled();
    expect(extensionsService.getExternalExtensions).not.toHaveBeenCalled();
  });

  describe('ngOnInit', () => {
    it('should set the iFrame src attribute to an url if there is an extension', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        of([new MicroFrontend(frontend)])
      );
      spyOn(extensionsService, 'getExternalExtensions').and.returnValue(of([]));

      testNavigationEvent();

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual(
        frontend.spec.navigationNodes[0].viewUrl
      );
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extensionsService.getExternalExtensions).not.toHaveBeenCalled();
    });

    it('should set the iFrame src attribute to an url if there is a cluster extension', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(of([]));
      spyOn(extensionsService, 'getExternalExtensions').and.returnValue(
        of([new MicroFrontend(frontend)])
      );

      testNavigationEvent();

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual(
        frontend.spec.navigationNodes[0].viewUrl
      );
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extensionsService.getExternalExtensions).toHaveBeenCalled();
    });

    it('should set the iFrame src to an empty string if there are no extensions', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(of([]));
      spyOn(extensionsService, 'getExternalExtensions').and.returnValue(of([]));

      testNavigationEvent();

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual('');
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extensionsService.getExternalExtensions).toHaveBeenCalled();
    });

    it('should handle an error and set the iFrame src attribute to an empty string', () => {
      spyOn(extensionsService, 'getExtensions').and.callFake(() => {
        return throwError('error');
      });
      spyOn(extensionsService, 'getExternalExtensions').and.returnValue(of([]));

      testNavigationEvent();

      fixture.detectChanges();
      const iFrame = document.getElementById('externalViewFrame');
      expect(iFrame.getAttribute('src')).toEqual('');
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extensionsService.getExternalExtensions).not.toHaveBeenCalled();
    });
  });

  describe('renderExternalView', () => {
    it('should register external view and send a message', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        of([new MicroFrontend(frontend)])
      );
      spyOn(extensionsService, 'getExternalExtensions').and.returnValue(of([]));
      spyOn(extAppViewRegistryService, 'registerView').and.returnValue(
        '10-10-10'
      );

      testNavigationEvent();

      fixture.detectChanges();
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extensionsService.getExternalExtensions).not.toHaveBeenCalled();

      expect(extAppViewRegistryService.registerView).toHaveBeenCalled();
    });

    it('should deregister external view', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(of([]));
      spyOn(extensionsService, 'getExternalExtensions').and.returnValue(of([]));
      spyOn(extAppViewRegistryService, 'deregisterView');

      testNavigationEvent();

      fixture.detectChanges();
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extensionsService.getExternalExtensions).toHaveBeenCalled();
      expect(extAppViewRegistryService.deregisterView).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should deregister external view', () => {
      spyOn(extensionsService, 'getExtensions').and.returnValue(
        of([new MicroFrontend(frontend)])
      );
      spyOn(extensionsService, 'getExternalExtensions').and.returnValue(of([]));
      spyOn(extAppViewRegistryService, 'deregisterView');

      testNavigationEvent();

      fixture.detectChanges();
      component.ngOnDestroy();
      expect(extensionsService.getExtensions).toHaveBeenCalled();
      expect(extensionsService.getExternalExtensions).not.toHaveBeenCalled();
      expect(extAppViewRegistryService.deregisterView).toHaveBeenCalled();
    });
  });
});
