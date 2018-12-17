import { Directive } from '@angular/core';
import { Router } from '@angular/router';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { Subscription } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { PageDirtyStateService } from '../../shared/services/page-dirty-state.service';

@Directive({
  selector: '[extAppListener]'
})
export class ExtAppListenerDirective {
  private currentEnvironmentService: CurrentEnvironmentService;
  private currentEnvironmentSubscription: Subscription;
  private currentEnvironmentId: string;

  constructor(
    private router: Router,
    private extAppViewRegistryService: ExtAppViewRegistryService,
    private oauthService: OAuthService,
    private pageDirtyService: PageDirtyStateService,
    currentEnvironmentService: CurrentEnvironmentService
  ) {
    window.addEventListener('message', this.processMessage.bind(this), false);
    this.currentEnvironmentService = currentEnvironmentService;
    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
      });
  }

  processMessage(event) {
    if (this.extAppViewRegistryService.isRegistered(event.source)) {
      let data;
      try {
        data = event.data;
        if (data && data.msg.indexOf('luigi.') === 0) {
          this.processLuigiMessage(data, event.source);
        } else if (
          // support for legacy integration of lambdas, service catalog and instances views
          this.extAppViewRegistryService.isRegisteredSession(
            event.source,
            data.sessionId
          )
        ) {
          if (data && data.msg.indexOf('navigation.') === 0) {
            this.processNavigationMessage(data);
          }
        } else {
          console.log(
            'Received message from not registered session. Origin: ' +
              event.origin
          );
        }
      } catch (error) {
        console.log('There is no data.');
      }
    } else if (this.windowLocation(event.origin) === 0) {
      // ignore messages from self
    } else {
      console.log(
        'Received message from not registered source. Origin: ' + event.origin
      );
    }
  }

  windowLocation(origin) {
    return window.location.href.indexOf(origin);
  }

  sendContextToClient(view, context) {
    view.postMessage(
      {
        msg: 'luigi.init',
        context: JSON.stringify({
          ...context,
          parentNavigationContexts: ['environment']
        }),
        nodeParams: JSON.stringify({}),
        internal: JSON.stringify({})
      },
      '*'
    );
  }

  concatenatePath(basePath, relativePath) {
    let path = basePath;
    if (!path) {
      return relativePath;
    }
    if (!relativePath) {
      return path;
    }
    if (path.endsWith('/')) {
      path = path.substring(0, path.length - 1);
    }
    if (!relativePath.startsWith('/')) {
      path += '/';
    }
    return path + relativePath;
  }

  handleNavigation(data) {
    const sanitizeLinkManagerLink = link => {
      return link.replace(/[^-A-Za-z0-9 &+@/%=~_|!:,.;\(\)]/g, '');
    };

    let path = null;
    if (data.params && data.params.link) {
      const currEnvPath =
        '/home/namespaces/' + encodeURIComponent(this.currentEnvironmentId);
      if (data.params.fromClosestContext) {
        // from the closest navigation context
        if (this.router.url.startsWith(currEnvPath)) {
          path = this.concatenatePath(currEnvPath, data.params.link);
        }
      } else if (data.params.fromContext) {
        // from a given navigation context
        const navigationContext = data.params.fromContext;
        if (
          navigationContext === 'environment' &&
          this.router.url.startsWith(currEnvPath)
        ) {
          path = this.concatenatePath(currEnvPath, data.params.link);
        }
      } else if (data.params.relative) {
        // relative
        path = this.concatenatePath(this.router.url, data.params.link);
      } else {
        path = data.params.link;
      }

      if (path) {
        this.router.navigate([sanitizeLinkManagerLink(path)]).catch(e => {
          console.log('Route not found');
        });
      }
    } else {
      console.log('missing "data.params.link" in the incoming message');
    }
  }

  processLuigiMessage(data, source) {
    if ('luigi.get-context' === data.msg && source) {
      const context = {
        currentEnvironmentId: this.currentEnvironmentId,
        idToken: this.oauthService.getIdToken()
      };

      this.sendContextToClient(source, context);
    }

    if ('luigi.navigate.ok' === data.msg) {
      this.extAppViewRegistryService.confirmNavigation(source);
    }

    if ('luigi.navigation.open' === data.msg) {
      this.handleNavigation(data);
    }

    if ('luigi.set-page-dirty' === data.msg) {
      this.pageDirtyService.setPageDirty(data.dirty);
    }
  }

  // support for legacy integration of lambdas, service catalog and instances views
  processNavigationMessage(data) {
    const sanitizeLinkManagerLink = link => {
      return link.replace(/[^-A-Za-z0-9 &+@/%=~_|!:,.;\(\)]/g, '');
    };

    if (data && data.msg === 'navigation.open') {
      if (data.params && data.params.link) {
        this.router
          .navigate([sanitizeLinkManagerLink(data.params.link)])
          .catch(e => {
            console.log('Route not found');
          });
      } else {
        console.log('missing "data.params.link" in the incoming message');
      }
    } else {
      console.log('unknown or missing message type in the incoming message');
    }
  }
}
