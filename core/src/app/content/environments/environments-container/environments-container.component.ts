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

import { NavVisibilityService } from '../../../navigation/services/nav-visibility.service';
import { CurrentEnvironmentService } from '../services/current-environment.service';
import { EnvironmentsService } from '../services/environments.service';
import { InformationModalComponent } from '../../../shared/components/information-modal/information-modal.component';
import { Subscription } from 'rxjs';
import NavigationUtils from '../../../navigation/services/navigation-utils';

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
  private router: Router;
  private route: ActivatedRoute;
  public isActive: boolean;
  private navSub: Subscription;
  private routerSub: Subscription;
  public fadeIn = '1';
  public leftNavCollapsed = false;
  public previousUrl = '';

  @ViewChild('infoModal') private infoModal: InformationModalComponent;

  constructor(
    router: Router,
    route: ActivatedRoute,
    @Inject(NavVisibilityService) navVisibilityService: NavVisibilityService,
    private environmentsService: EnvironmentsService,
    private currentEnvironmentService: CurrentEnvironmentService
  ) {
    this.router = router;
    this.route = route;
    this.navSub = navVisibilityService.visibilityStateEmitter$.subscribe(
      visible => (this.isActive = visible)
    );
    this.routerSub = router.events.subscribe(val => {
      if (val instanceof ActivationEnd) {
        this.leftNavCollapsed = NavigationUtils.computeLeftNavCollapseState(
          val.snapshot
        );
      }
      if (val instanceof NavigationEnd) {
        if (this.isSignificantUrlChange(val.url, this.previousUrl)) {
          this.toggleFade();
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
                `Environment ${envId} doesn't exist.`,
                '/home/environments'
              );
            }
          }
        );
      }
    });
  }

  public ngOnDestroy() {
    this.navSub.unsubscribe();
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
}
