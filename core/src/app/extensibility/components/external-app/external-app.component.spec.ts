import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAppComponent } from './external-app.component';
import { CurrentEnvironmentService } from '../../../content/environments/services/current-environment.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { ExtAppViewRegistryService } from '../../services/ext-app-view-registry.service';
import { Observable } from 'rxjs/Observable';
import { ExtensionsService } from '../../services/extensions.service';

const CurrentEnvironmentServiceStub = {
  getCurrentEnvironmentId() {
    return Observable.of('envId');
  }
};

const OAuthServiceStub = {
  getIdToken() {
    return 'token';
  }
};

const ExtAppViewRegistryServiceStub = {
  registerView(contentView) {
    return 'abc12345';
  },
  deregisterView(contentView) {
    return 'deregistered';
  }
};

const ExtensionsServiceStub = {
  getExtensions() {
    return Observable.of([]);
  },
  isUsingSecureProtocol() {
    return true;
  }
};

describe('ExternalAppComponent', () => {
  let component: ExternalAppComponent;
  let fixture: ComponentFixture<ExternalAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalAppComponent],
      providers: [
        {
          provide: CurrentEnvironmentService,
          useValue: CurrentEnvironmentServiceStub
        },
        { provide: OAuthService, useValue: OAuthServiceStub },
        {
          provide: ExtAppViewRegistryService,
          useValue: ExtAppViewRegistryServiceStub
        },
        {
          provide: ExtensionsService,
          useValue: ExtensionsServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create message', () => {
    // given
    const iframeElement = document.createElement('iframe');
    const basePath = '/home/environments/';

    // when
    const message = component.getMessage(iframeElement, basePath);

    // then
    const expectedMessage = {
      currentEnvironmentId: 'envId',
      idToken: 'token',
      sessionId: 'abc12345',
      linkManagerData: {
        basePath: '/home/environments/'
      }
    };
    expect(message).toEqual(expectedMessage);
  });

  it('should create transfer object with external data', () => {
    // given
    const iframeElement = document.createElement('iframe');
    const basePath = '/home/environments/';
    const externalData = {
      environments: ['one', 'two'],
      linkManagerData: {
        basePath: '/home/my-environments/'
      }
    };

    // when
    const message = component.getMessage(iframeElement, basePath, externalData);

    // then
    const expectedMessage = {
      environments: ['one', 'two'],
      currentEnvironmentId: 'envId',
      idToken: 'token',
      sessionId: 'abc12345',
      linkManagerData: {
        basePath: '/home/my-environments/'
      }
    };
    expect(message).toEqual(expectedMessage);
  });
});
