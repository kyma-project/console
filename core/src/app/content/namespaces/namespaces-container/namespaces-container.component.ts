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
import { CurrentNamespaceService } from '../services/current-namespace.service';
import { NamespacesService } from '../services/namespaces.service';
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
  selector: 'app-namespaces-container',
  templateUrl: './namespaces-container.component.html',
  styleUrls: ['./namespaces-container.component.scss'],
  animations: [fadeInAnimation]
})
export class NamespacesContainerComponent implements OnInit, OnDestroy {
  public navCtx: string;
  public isActive: boolean;
  private navSub: Subscription;
  private routerSub: Subscription;
  public communicationServiceSubscription: Subscription;
  public fadeIn = '1';
  public leftNavCollapsed = false;
  public previousUrl = '';
  public previousNamespace = '';
  public limitHasBeenExceeded = false;
  public limitExceededErrors = [];
  public overview = false;

  @ViewChild('infoModal') private infoModal: InformationModalComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private namespacesService: NamespacesService,
    private currentNamespaceService: CurrentNamespaceService,
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
    this.route.params.subscribe(params => {
      const namespaceId = params['namespaceId'];
      this.currentNamespaceService.setCurrentNamespaceId(namespaceId);
      if (namespaceId) {
        this.namespacesService.getNamespace(namespaceId).subscribe(
          () => {
            /* OK */
          },
          err => {
            if (err.status === 404) {
              this.infoModal.show(
                'Error',
                `Namespace ${namespaceId} doesn't exist.`,
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
    const namespaceExtUrlPattern = /^\/home\/namespaces\/[^\/]+\/extensions\/.+$/;
    const clusterExtUrlPattern = /^\/home\/settings\/extensions\/.+$/;
    if (previousUrl) {
      if (url === previousUrl) {
        return false;
      }
      if (url.match(namespaceExtUrlPattern) && previousUrl.match(namespaceExtUrlPattern)) {
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

  private checkIfResourceLimitExceeded(url) {
    this.currentNamespaceService
      .getCurrentNamespaceId()
      .pipe(
        tap(namespace => (this.overview = url.includes(`${namespace}/details`))),
        filter(namespace => url.includes('namespaces/' + namespace)),
        filter(namespace => namespace !== this.previousNamespace || this.overview),
        take(1),
        concatMap(namespace =>
          this.namespacesService.getResourceQueryStatus(namespace).pipe(
            map(res => ({
              namespace,
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
        ({ namespace, quotaExceeded, limitExceededErrors }) => {
          this.limitHasBeenExceeded = quotaExceeded;
          if (namespace !== this.previousNamespace || this.overview) {
            this.previousNamespace = namespace;
          }
          if (
            quotaExceeded &&
            limitExceededErrors &&
            limitExceededErrors.length > 0
          ) {
            const data = {
              resourceQuotasStatus: {
                exceeded: quotaExceeded,
                exceededQuotas: limitExceededErrors
              }
            };
            const msg = {
              msg: 'console.quotaexceeded',
              data,
              namespace: this.previousNamespace
            };
            window.parent.postMessage(msg, '*');
          }
        },
        err => {
          console.log(err);
        }
      );
  }
}
