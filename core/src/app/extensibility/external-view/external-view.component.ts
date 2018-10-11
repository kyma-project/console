import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtensionsService } from '../services/extensions.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { combineLatest, Subscription } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { MicroFrontend } from '../../shared/datamodel/k8s/microfrontend';

const contextVarPrefix = 'context.';

@Component({
  selector: 'app-external-view',
  templateUrl: './external-view.component.html',
  styleUrls: ['./external-view.component.scss'],
  host: { class: 'sf-main sf-content-external' }
})
export class ExternalViewComponent implements OnInit, OnDestroy {
  public externalViewLocation: string;
  private extensionsService: ExtensionsService;
  private currentEnvironmentService: CurrentEnvironmentService;
  private currentEnvironmentSubscription: Subscription;
  private currentEnvironmentId: string;
  private confirmationCheckTimeout: number = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    extensionsService: ExtensionsService,
    currentEnvironmentService: CurrentEnvironmentService,
    private oauthService: OAuthService,
    private extAppViewRegistryService: ExtAppViewRegistryService
  ) {
    this.extensionsService = extensionsService;
    this.currentEnvironmentService = currentEnvironmentService;

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
      });
  }

  private getMatchingViewsForPathAndContext(
    microfrontends: MicroFrontend[],
    path: string,
    navigationContext: string
  ) {
    const result = [];
    microfrontends.forEach(mf => {
      const navigationNode = mf.getNavigationNodeForPath(path);
      if (navigationNode) {
        if (navigationContext) {
          if (
            mf.spec.placement &&
            mf.spec.placement.split(',').includes(navigationContext)
          ) {
            result.push({ mf, navigationNode });
          }
        } else {
          result.push({ mf, navigationNode });
        }
      }
    });
    return result;
  }

  ngOnInit() {
    combineLatest(this.route.params, this.route.data).subscribe(
      paramsAndData => {
        const params = paramsAndData[0];
        const data = paramsAndData[1];
        let path = params['pathSegment1'];
        if (params['pathSegment2']) {
          path += '/' + params['pathSegment2'];
        }
        if (params['pathSegment3']) {
          path += '/' + params['pathSegment3'];
        }

        this.extensionsService
          .getExtensions(this.currentEnvironmentId)
          .pipe(
            map(res => this.getMatchingViewsForPathAndContext(res, path, null)),
            first(),
            catchError(error => {
              this.externalViewLocation = '';
              throw error;
            })
          )
          .subscribe(
            extensions => {
              if (extensions.length > 0) {
                this.externalViewLocation =
                  extensions[0].navigationNode.computedViewUrl;
                this.renderExternalView();
              } else {
                this.extensionsService
                  .getExternalExtensions()
                  .pipe(
                    map(res =>
                      this.getMatchingViewsForPathAndContext(
                        res,
                        path,
                        data.navigationContext
                      )
                    ),
                    first(),
                    catchError(error => {
                      this.externalViewLocation = '';
                      throw error;
                    })
                  )
                  .subscribe(
                    clusterExtensions => {
                      this.externalViewLocation =
                        clusterExtensions.length > 0
                          ? clusterExtensions[0].navigationNode.computedViewUrl
                          : '';
                      this.renderExternalView();
                    },
                    error => {
                      this.renderExternalView();
                    }
                  );
              }
            },
            error => {
              this.renderExternalView();
            }
          );
      }
    );
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  replaceVars(viewUrl, params, prefix) {
    let processedUrl = viewUrl;
    if (params) {
      Object.entries(params).forEach(entry => {
        processedUrl = processedUrl.replace(
          '{' + prefix + entry[0] + '}',
          encodeURIComponent(entry[1] ? entry[1].toString() : '')
        );
      });
    }
    processedUrl = processedUrl.replace(
      new RegExp('\\{' + this.escapeRegExp(prefix) + '[^\\}]+\\}', 'g'),
      ''
    );
    return processedUrl;
  }

  getUrlWithoutHash(url) {
    if (!url) {
      return false;
    }
    const urlWithoutHash = url.split('#')[0];

    // We assume that any URL not starting with
    // http is on the current page's domain
    if (!urlWithoutHash.startsWith('http')) {
      return (
        window.location.origin +
        (urlWithoutHash.startsWith('/') ? '' : '/') +
        urlWithoutHash
      );
    }

    return urlWithoutHash;
  }

  isNotSameDomain(viewUrl, iframe) {
    if (iframe) {
      const previousUrl = this.getUrlWithoutHash(iframe.src);
      const nextUrl = this.getUrlWithoutHash(viewUrl);
      return previousUrl !== nextUrl;
    }
    return true;
  }

  renderExternalView() {
    const element = document.getElementById(
      'externalViewFrame'
    ) as HTMLIFrameElement;

    if (
      !this.extensionsService.isUsingSecureProtocol(this.externalViewLocation)
    ) {
      return;
    }

    if (this.confirmationCheckTimeout !== null) {
      window.clearTimeout(this.confirmationCheckTimeout);
      this.confirmationCheckTimeout = null;
    }

    const context = {
      currentEnvironmentId: this.currentEnvironmentId,
      idToken: this.oauthService.getIdToken()
    };

    const viewUrl = this.replaceVars(
      this.externalViewLocation,
      context,
      contextVarPrefix
    );

    if (viewUrl) {
      if (this.isNotSameDomain(viewUrl, element)) {
        element.src = viewUrl;
        const sessionId = this.extAppViewRegistryService.registerView(
          element.contentWindow
        );
      } else {
        this.extAppViewRegistryService.resetNavigationConfirmation(
          element.contentWindow
        );

        element.contentWindow.postMessage(
          {
            msg: 'luigi.navigate',
            viewUrl,
            context: JSON.stringify({
              ...context,
              parentNavigationContexts: ['environment']
            }),
            nodeParams: JSON.stringify({}),
            internal: JSON.stringify({})
          },
          '*'
        );

        /**
         * check if luigi responded
         * if not, callback again to replace the iframe
         */
        this.confirmationCheckTimeout = window.setTimeout(() => {
          if (
            this.extAppViewRegistryService.isNavigationConfirmed(
              element.contentWindow
            )
          ) {
            this.extAppViewRegistryService.resetNavigationConfirmation(
              element.contentWindow
            );
          } else {
            element.src = '';
            console.info(
              'navigate: luigi-client did not respond, using fallback by replacing iframe'
            );
            this.renderExternalView();
          }
        }, 2000);
      }
    } else {
      element.src = '';
      this.extAppViewRegistryService.deregisterView(element.contentWindow);
    }
  }

  ngOnDestroy() {
    if (this.confirmationCheckTimeout !== null) {
      window.clearTimeout(this.confirmationCheckTimeout);
      this.confirmationCheckTimeout = null;
    }
    const element = document.getElementById(
      'externalViewFrame'
    ) as HTMLIFrameElement;
    if (this.externalViewLocation) {
      this.extAppViewRegistryService.deregisterView(element.contentWindow);
    }

    this.currentEnvironmentSubscription.unsubscribe();
  }
}
