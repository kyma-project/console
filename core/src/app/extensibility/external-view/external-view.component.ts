import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtensionsService } from '../services/extensions.service';
import { CurrentEnvironmentService } from '../../content/environments/services/current-environment.service';
import { ExtAppViewRegistryService } from '../services/ext-app-view-registry.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subscription } from 'rxjs/Subscription';
import { AppConfig } from '../../app.config';

const contextVarPrefix = 'context.';

@Component({
  selector: 'app-external-view',
  templateUrl: './external-view.component.html',
  styleUrls: ['./external-view.component.scss'],
  host: { class: 'sf-main sf-content-external' }
})
export class ExternalViewComponent implements OnInit, OnDestroy {
  private externalViewId: string;
  public externalViewLocation: string;
  private extensionsService: ExtensionsService;
  private currentEnvironmentService: CurrentEnvironmentService;
  private currentEnvironmentSubscription: Subscription;
  private currentEnvironmentId: string;

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

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.externalViewId = params['id'];
      this.extensionsService
        .getExtensions(this.currentEnvironmentId)
        .map(res =>
          res.filter(ext => {
            return ext.getId() === this.externalViewId;
          })
        )
        .first()
        .catch(error => {
          this.externalViewLocation = '';
          throw error;
        })
        .subscribe(
          ext => {
            this.externalViewLocation = ext[0] ? ext[0].getLocation() : '';
            if (this.externalViewLocation === 'minio') {
              this.externalViewLocation = '';
            }
            this.renderExternalView();
          },
          error => {
            this.renderExternalView();
          }
        );
    });
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
          encodeURIComponent(entry[1])
        );
      });
    }
    processedUrl = processedUrl.replace(
      new RegExp('\\{' + this.escapeRegExp(prefix) + '[^\\}]+\\}', 'g'),
      ''
    );
    return processedUrl;
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

    const context = {
      currentEnvironmentId: this.currentEnvironmentId,
      idToken: this.oauthService.getIdToken()
    };

    // TODO REMOVE!!!
    let viewUrl = this.externalViewLocation.replace('https:', 'http:');
    //

    viewUrl = this.replaceVars(viewUrl, context, contextVarPrefix);
    element.src = viewUrl;
    if (viewUrl) {
      const sessionId = this.extAppViewRegistryService.registerView(
        element.contentWindow
      );

      /* LATER
      element.contentWindow.postMessage(
        {
          msg: 'luigi.navigate',
          viewUrl,
          context: JSON.stringify({...context}),
          nodeParams: JSON.stringify({}),
          internal: JSON.stringify({})
        },
        '*'
      );
      */

      /* OLD element.onload = () => {
        const transferObject = {
          currentEnvironmentId: this.currentEnvironmentId,
          idToken: this.oauthService.getIdToken(),
          sessionId,
          linkManagerData: {
            basePath: '/home/environments/'
          }
        };
        element.contentWindow.postMessage(['init', transferObject], '*');
      };
      */
    } else {
      this.extAppViewRegistryService.deregisterView(element.contentWindow);
    }
  }

  ngOnDestroy() {
    const element = document.getElementById(
      'externalViewFrame'
    ) as HTMLIFrameElement;
    if (this.externalViewLocation) {
      this.extAppViewRegistryService.deregisterView(element.contentWindow);
    }

    this.currentEnvironmentSubscription.unsubscribe();
  }
}
