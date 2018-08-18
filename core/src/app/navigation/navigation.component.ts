import { Component, OnInit, Inject, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EnvironmentInfo } from '../content/environments/environment-info';
import { EnvironmentsService } from '../content/environments/services/environments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ExtensionsService } from '../extensibility/services/extensions.service';
import { navModel } from './app.navigation.data';
import { CurrentEnvironmentService } from '../content/environments/services/current-environment.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  host: { class: 'sf-navigation' }
})
export class NavigationComponent implements OnInit {
  @Input() navCtx: string;
  environment: EnvironmentInfo;
  environmentsService: EnvironmentsService;
  extensionsService: ExtensionsService;
  environments = [];
  ariaExpanded = false;
  ariaHidden = true;
  currentEnvironmentId = null;
  currentNavModel = navModel.env;
  private currentEnvironmentSubscription: Subscription;
  private lastEnvironmentId: string;
  isActive: boolean;
  environmentName;
  filteredEnvironments = [];

  constructor(
    @Inject(EnvironmentsService) environmentsService: EnvironmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private currentEnvironmentService: CurrentEnvironmentService,
    extensionsService: ExtensionsService
  ) {
    this.environmentsService = environmentsService;
    this.extensionsService = extensionsService;
    this.environmentsService.envChangeStateEmitter$.subscribe(() => {
      this.ngOnInit();
    });

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        this.lastEnvironmentId = envId;
        if (envId) {
          this.environmentName = envId;
        }
      });
  }

  changeRoute(link: string) {
    const r = this.route;
    const urlTree = this.router.createUrlTree([link], { relativeTo: r });
    if (this.router.isActive(urlTree, true)) {
      // do refresh
      this.router
        .navigate(['yVirtual'], {
          relativeTo: r,
          skipLocationChange: true
        })
        .then(() => {
          this.router.navigateByUrl(urlTree);
        });
    } else {
      this.router.navigateByUrl(urlTree);
    }
  }

  ngOnInit() {
    this.currentNavModel = navModel[this.navCtx];
    this.route.params.subscribe(params => {
      this.currentEnvironmentId = params['environmentId'];
      this.extensionsService
        .getExtensions(this.currentEnvironmentId)
        .subscribe(exts => {
          this.currentNavModel = _.cloneDeep(navModel[this.navCtx]);

          const extViews = new Map();
          exts.forEach(ext => {
            let category = 'External Views';
            if (ext.spec.navigation && ext.spec.navigation.category) {
              category = ext.spec.navigation.category;
            }
            let catExts = extViews.get(category);
            if (!catExts) {
              catExts = [];
              extViews.set(category, catExts);
            }
            catExts.push(ext);
          });

          extViews.forEach((views, category) => {
            views.forEach(view => {
              this.addEntryToNavigationGroup(category, {
                name: view.getLabel(),
                link: 'extensions/' + view.getId()
              });
            });
          });
        });
    });

    this.environmentsService.getEnvironments().subscribe(
      res => {
        this.environments = res;
        this.filteredEnvironments = res;
      },
      err => console.log(err)
    );
  }

  getNavigationGroup(groupName) {
    let result = null;
    if (this.currentNavModel.groups) {
      this.currentNavModel.groups.forEach(group => {
        if (
          group.name &&
          group.name.toLowerCase() === groupName.toLowerCase()
        ) {
          result = group;
        }
      });
    }
    return result;
  }

  public goToEnvironments() {
    const currentEnvironmentId = this.lastEnvironmentId;
    const link =
      'home/' +
      (currentEnvironmentId
        ? 'environments/' + currentEnvironmentId
        : 'environments');
    this.router.navigateByUrl(link);
  }

  hasNavigationGroup(groupName) {
    return this.getNavigationGroup(groupName) !== null;
  }

  addEntryToNavigationGroup(groupName, entry) {
    let group = this.getNavigationGroup(groupName);
    if (!group) {
      group = {
        name: groupName,
        entries: []
      };
      this.currentNavModel.groups.push(group);
    }
    let entries = group.entries;
    if (!entries) {
      group.entries = [];
      entries = group.entries;
    }
    entries.push(entry);
  }

  toggleDropDown() {
    this.ariaExpanded = !this.ariaExpanded;
    this.ariaHidden = !this.ariaHidden;
  }

  closeDropDown() {
    this.ariaExpanded = false;
    this.ariaHidden = true;
    if (this.currentEnvironmentId) {
      this.environmentName = this.currentEnvironmentId;
    }
  }

  openDropDown(event: Event) {
    event.stopPropagation();
    this.ariaExpanded = true;
    this.ariaHidden = false;
  }

  selectEnv(env) {
    let routeTarget = '';
    if (this.currentEnvironmentId) {
      const currentPath: string = this.router.url;
      const envRoot: string = '/home/environments/' + this.currentEnvironmentId;
      routeTarget = currentPath.replace(envRoot, '');
    }
    this.router
      .navigateByUrl('/home/environments/' + env.id + '/workspace')
      .then(dontcare => {
        if (
          routeTarget.indexOf('extensions/') < 0 ||
          routeTarget.indexOf('extensions/') > 1
        ) {
          this.router.navigateByUrl(
            '/home/environments/' + env.id + routeTarget
          );
        }
      });
  }

  filterEnvs() {
    this.filteredEnvironments = [];
    this.environments.forEach(element => {
      if (element.label.includes(this.environmentName.toLowerCase())) {
        this.filteredEnvironments.push(element);
      }
    });
  }
}
