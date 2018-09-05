import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ExtAppListenerDirective } from './ext-app-listener.directive';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ReplaySubject } from 'rxjs';

describe('ExtAppListenerDirective', () => {
  let extAppListenerDirective: ExtAppListenerDirective;
  let extAppViewRegistryService: ExtAppViewRegistryService;
  let router;

  const routerMock = {
    navigate(url) {
      if (url[0] === 'link') {
        return Promise.resolve(true);
      } else {
        return Promise.reject(false);
      }
    }
  };

  const OAuthServiceMock = {
    getIdToken: () => {
      return 'token';
    },
    initImplicitFlow: () => {
      return;
    }
  };

  const CurrentEnvironmentServiceMock = {
    getCurrentEnvironmentId(): ReplaySubject<string> {
      const currentEnvId = new ReplaySubject<string>(1);
      currentEnvId.next('tetsEnv');
      return currentEnvId;
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExtAppListenerDirective,
        ExtAppViewRegistryService,
        {
          provide: CurrentEnvironmentService,
          useValue: CurrentEnvironmentServiceMock
        },
        { provide: OAuthService, useValue: OAuthServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    extAppViewRegistryService = TestBed.get(ExtAppViewRegistryService);
    extAppListenerDirective = TestBed.get(ExtAppListenerDirective);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(extAppViewRegistryService).toBeTruthy();
  });

  describe('processMessage', () => {
    it('should process the message', () => {
      const event = {
        data: {
          msg: 'navigation.open'
        },
        source: 'source',
        sessionId: 'sessionId',
        origin: 'origin'
      };
      spyOn(extAppViewRegistryService, 'isRegistered').and.returnValue(true);
      spyOn(extAppViewRegistryService, 'isRegisteredSession').and.returnValue(
        true
      );
      spyOn(extAppListenerDirective, 'processNavigationMessage');
      extAppListenerDirective.processMessage(event);
      expect(extAppViewRegistryService.isRegisteredSession).toHaveBeenCalled();
      expect(
        extAppListenerDirective.processNavigationMessage
      ).toHaveBeenCalled();
    });

    it("shouldn't process the message if there is no data", () => {
      spyOn(extAppViewRegistryService, 'isRegistered').and.returnValue(
        '10-10-10'
      );
      spyOn(extAppViewRegistryService, 'isRegisteredSession');
      spyOn(console, 'log').and.callThrough();
      extAppListenerDirective.processMessage('data');
      expect(
        extAppViewRegistryService.isRegisteredSession
      ).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('There is no data.');
    });

    it("shouldn't process the message if no navigation value in data.msg", () => {
      const event = {
        data: {
          msg: 'nav.navigation'
        },
        source: 'source',
        sessionId: 'sessionId',
        origin: 'origin'
      };
      spyOn(extAppViewRegistryService, 'isRegistered').and.returnValue(true);
      spyOn(extAppViewRegistryService, 'isRegisteredSession').and.returnValue(
        true
      );
      spyOn(extAppListenerDirective, 'processNavigationMessage');
      extAppListenerDirective.processMessage(event);
      expect(extAppViewRegistryService.isRegisteredSession).toHaveBeenCalled();
      expect(
        extAppListenerDirective.processNavigationMessage
      ).not.toHaveBeenCalled();
    });

    it("shouldn't process the message if the session is not registered", () => {
      const event = {
        data: {
          msg: 'navigation.open'
        },
        source: 'source',
        sessionId: 'sessionId',
        origin: 'origin'
      };
      spyOn(extAppViewRegistryService, 'isRegistered').and.returnValue(true);
      spyOn(extAppViewRegistryService, 'isRegisteredSession').and.returnValue(
        false
      );
      spyOn(extAppListenerDirective, 'processNavigationMessage');
      spyOn(console, 'log').and.callThrough();
      extAppListenerDirective.processMessage(event);
      expect(extAppViewRegistryService.isRegisteredSession).toHaveBeenCalled();
      expect(
        extAppListenerDirective.processNavigationMessage
      ).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'Received message from not registered session. Origin: ' + event.origin
      );
    });

    it("shouldn't process the message if it receives the message from self", () => {
      const event = {
        data: {
          msg: 'navigation.open'
        },
        source: 'source',
        sessionId: 'sessionId',
        origin: 'origin'
      };
      spyOn(extAppViewRegistryService, 'isRegistered').and.returnValue(false);
      spyOn(extAppListenerDirective, 'windowLocation').and.returnValue(0);
      spyOn(extAppViewRegistryService, 'isRegisteredSession');
      spyOn(extAppListenerDirective, 'processNavigationMessage');
      extAppListenerDirective.processMessage(event);
      expect(
        extAppViewRegistryService.isRegisteredSession
      ).not.toHaveBeenCalled();
      expect(
        extAppListenerDirective.processNavigationMessage
      ).not.toHaveBeenCalled();
    });

    it("shouldn't process the message if the event source is not registered", () => {
      const event = {
        data: {
          msg: 'navigation.open'
        },
        source: 'source',
        sessionId: 'sessionId',
        origin: 'origin'
      };
      spyOn(extAppViewRegistryService, 'isRegistered').and.returnValue(false);
      spyOn(extAppListenerDirective, 'windowLocation').and.returnValue(-1);
      spyOn(extAppViewRegistryService, 'isRegisteredSession');
      spyOn(extAppListenerDirective, 'processNavigationMessage');
      spyOn(console, 'log').and.callThrough();
      extAppListenerDirective.processMessage(event);
      expect(
        extAppViewRegistryService.isRegisteredSession
      ).not.toHaveBeenCalled();
      expect(
        extAppListenerDirective.processNavigationMessage
      ).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'Received message from not registered source. Origin: ' + event.origin
      );
    });
  });

  describe('processNavigationMessage', () => {
    it('should navigate to the given link', () => {
      spyOn(router, 'navigate').and.callThrough();
      const data = {
        msg: 'navigation.open',
        params: {
          link: 'link'
        }
      };
      extAppListenerDirective.processNavigationMessage(data);
      expect(router.navigate).toHaveBeenCalledWith([data.params.link]);
    });

    it("should handle an error if couldn't navigate to the given link", async () => {
      spyOn(router, 'navigate').and.callThrough();
      spyOn(console, 'log').and.callThrough();
      const data = {
        msg: 'navigation.open',
        params: {
          link: 'wrongLink'
        }
      };
      await extAppListenerDirective.processNavigationMessage(data);
      expect(router.navigate).toHaveBeenCalledWith([data.params.link]);
      expect(console.log).toHaveBeenCalledWith('Route not found');
    });

    it("shouldn't navigate anywhere if no link is given", () => {
      spyOn(router, 'navigate').and.callThrough();
      spyOn(console, 'log').and.callThrough();
      const data = {
        msg: 'navigation.open'
      };
      extAppListenerDirective.processNavigationMessage(data);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'missing "data.params.link" in the incoming message'
      );
    });

    it("shouldn't navigate anywhere if there is no / wrong message", () => {
      spyOn(router, 'navigate').and.callThrough();
      spyOn(console, 'log').and.callThrough();
      const data = {
        msg: 'navigation.close'
      };
      extAppListenerDirective.processNavigationMessage(data);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        'unknown or missing message type in the incoming message'
      );
    });
  });

  describe('windowLocation', () => {
    it('should return index of origin', () => {
      const result = extAppListenerDirective.windowLocation('http');
      expect(result).toEqual(window.location.href.indexOf('http'));
    });
  });
});
