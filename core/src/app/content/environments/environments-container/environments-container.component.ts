import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  ActivationEnd
} from '@angular/router';
import {
  trigger,
  state,
  animate,
  transition,
  style
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { filter, tap, take, map, concatMap } from 'rxjs/operators';
import { CurrentEnvironmentService } from '../services/current-environment.service';
import { EnvironmentsService } from '../services/environments.service';
import { InformationModalComponent } from '../../../shared/components/information-modal/information-modal.component';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import * as LuigiClient from '@kyma-project/luigi-client';

const fadeInAnimation = trigger('fadeInAnimation', [
  state('1', style({ opacity: 1 })),
  state('2', style({ opacity: 1 })),
  transition('1 <=> 2, :enter', [
    style({ opacity: 0 }),
    animate('.3s', style({ opacity: 1 }))
  ])
]);

@Component({
  selector: 'app-environments-container',
  templateUrl: './environments-container.component.html',
  styleUrls: ['./environments-container.component.scss'],
  animations: [fadeInAnimation]
})
export class EnvironmentsContainerComponent implements OnInit, OnDestroy {
  public navCtx: string;
  public isActive: boolean;
  private navSub: Subscription;
  private routerSub: Subscription;
  public communicationServiceSubscription: Subscription;
  public fadeIn = '1';
  public leftNavCollapsed = false;
  public previousUrl = '';
  public previousEnv = '';
  public displayErrorGlobal = false;
  public limitHasBeenExceeded = false;
  public limitExceededErrors = [];
  public overview = false;

  @ViewChild('infoModal') private infoModal: InformationModalComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private environmentsService: EnvironmentsService,
    private currentEnvironmentService: CurrentEnvironmentService,
    private componentCommunicationService: ComponentCommunicationService
  ) {
    this.routerSub = this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (this.isSignificantUrlChange(val.url, this.previousUrl)) {
          if (!this.isSmoothNavigationUrlChange(val.url, this.previousUrl)) {
            this.toggleFade();
          }
          this.checkIfResourceLimitExceeded(val.url);
        }
        this.previousUrl = val.url;
      }
    });
    this.route.data.subscribe(data => {
      this.navCtx = data.navCtx;
    });
  }

  public ngOnInit() {
    window.addEventListener('message', e => {
      if (e.data && e.data.resourceQuotasStatus) {
        this.limitHasBeenExceeded = e.data.resourceQuotasStatus.exceeded;
        this.displayErrorGlobal = true;
      }
      if (
        e.data &&
        e.data.resourceQuotasStatus &&
        e.data.resourceQuotasStatus.exceededQuotas &&
        e.data.resourceQuotasStatus.exceededQuotas.length > 0
      ) {
        this.setLimitExceededErrorsMessages(
          e.data.resourceQuotasStatus.exceededQuotas
        );
      }
    });
    this.route.params.subscribe(params => {
      const envId = params['environmentId'];
      if (envId) {
        this.currentEnvironmentService.setCurrentEnvironmentId(envId);
        this.environmentsService.getEnvironment(envId).subscribe(
          () => {
            /* OK */
          },
          err => {
            if (err.status === 404) {
              this.infoModal.show(
                'Error',
                `Namespace ${envId} doesn't exist.`,
                '/home/namespaces'
              );
            }
          }
        );
      }
    });
  }

  public ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  private toggleFade() {
    this.fadeIn = this.fadeIn === '1' ? '2' : '1';
  }

  private isSignificantUrlChange(url: string, previousUrl: string): boolean {
    if (url && url.indexOf('/yVirtual') >= 0) {
      return false;
    }
    if (previousUrl) {
      if (url === previousUrl) {
        return false;
      }
      const qpIndex = url.indexOf('?');
      if (qpIndex > 0) {
        if (url.substr(0, qpIndex) === previousUrl.substr(0, qpIndex)) {
          return false;
        }
      }
    }
    return true;
  }

  private isSmoothNavigationUrlChange(
    url: string,
    previousUrl: string
  ): boolean {
    const envExtUrlPattern = /^\/home\/namespaces\/[^\/]+\/extensions\/.+$/;
    const clusterExtUrlPattern = /^\/home\/settings\/extensions\/.+$/;
    if (previousUrl) {
      if (url === previousUrl) {
        return false;
      }
      if (url.match(envExtUrlPattern) && previousUrl.match(envExtUrlPattern)) {
        return true;
      }
      if (
        url.match(clusterExtUrlPattern) &&
        previousUrl.match(clusterExtUrlPattern)
      ) {
        return true;
      }
    }
    return false;
  }

  public hideError() {
    this.displayErrorGlobal = false;
  }

  private checkIfResourceLimitExceeded(url) {
    this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .pipe(
        tap(env => (this.overview = url.includes(`${env}/details`))),
        filter(env => url.includes('namespaces/' + env)),
        filter(env => env !== this.previousEnv || this.overview),
        take(1),
        concatMap(env =>
          this.environmentsService.getResourceQueryStatus(env).pipe(
            map(res => ({
              env,
              quotaExceeded:
                res && res.resourceQuotasStatus
                  ? res.resourceQuotasStatus.exceeded
                  : false,
              limitExceededErrors:
                res && res.resourceQuotasStatus && res.resourceQuotasStatus
                  ? res.resourceQuotasStatus.exceededQuotas
                  : []
            }))
          )
        )
      )
      .subscribe(
        ({ env, quotaExceeded, limitExceededErrors }) => {
          this.limitHasBeenExceeded = quotaExceeded;
          if (env !== this.previousEnv || this.overview) {
            this.previousEnv = env;
            this.displayErrorGlobal = quotaExceeded;
          }
          if (
            quotaExceeded &&
            limitExceededErrors &&
            limitExceededErrors.length > 0
          ) {
            this.setLimitExceededErrorsMessages(limitExceededErrors);
            const linkdata = {
              goToResourcesConfig: {
                text: 'Resources Configuration',
                url: `/home/namespaces/${env}/resources`
              }
            };
            let errorText = `Error! The following resource quota limit has been exceeded by the given resource:<br><br>`;
            this.limitExceededErrors.forEach(error => {
              errorText += `- ${error}<br>`;
            });
            errorText += `<br>See {goToResourcesConfig} for details.`;
            let settings = {
              text: errorText,
              type: 'error',
              links: linkdata
            };
            LuigiClient.uxManager()
              .showAlert(settings)
              .then(() => {});
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  private setLimitExceededErrorsMessages(limitExceededErrors) {
    this.limitExceededErrors = [];
    limitExceededErrors.forEach(resource => {
      if (resource.affectedResources && resource.affectedResources.length > 0) {
        resource.affectedResources.forEach(affectedResource => {
          this.limitExceededErrors.push(
            `'${resource.resourceName}' by '${affectedResource}' (${
              resource.quotaName
            })`
          );
        });
      }
    });
  }
}
