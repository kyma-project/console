import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router, ActivatedRoute, UrlTree } from '@angular/router';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';

import { EnvironmentInfo } from '../content/environments/environment-info';
import { EnvironmentsService } from '../content/environments/services/environments.service';
import { ExtensionsService } from '../extensibility/services/extensions.service';
import { navModel, INavTypes } from './app.navigation.data';
import { CurrentEnvironmentService } from '../content/environments/services/current-environment.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  host: { class: 'sf-navigation' }
})
export class NavigationComponent implements OnInit {
  @Input() navCtx: INavTypes;
  environment: EnvironmentInfo;
  environmentsService: EnvironmentsService;
  extensionsService: ExtensionsService;
  environments = [];
  ariaExpanded = false;
  ariaHidden = true;
  currentEnvironmentId = null;
  currentNavModel: any;
  private currentEnvironmentSubscription: Subscription;
  private lastEnvironmentId: string;
  isActive: boolean;
  environmentName;
  filteredEnvironments = [];
  externalViewsGroups = [];

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

  private getUrlTree(link: string): UrlTree {
    if (link.startsWith('/')) {
      return this.router.createUrlTree([link]);
    } else {
      const r = this.route;
      return this.currentEnvironmentId
        ? this.router.createUrlTree([link], { relativeTo: r })
        : this.router.createUrlTree([`home/settings/${link}`]);
    }
  }

  changeRoute(link: string) {
    const r = this.route;
    const urlTree = this.getUrlTree(link);
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
      this.currentNavModel = cloneDeep(navModel[this.navCtx]);
      this.currentEnvironmentId = params['environmentId'];
      this.getExtensions();
      if (
        this.currentNavModel &&
        (this.currentNavModel.showEnvChooser || this.navCtx === 'settings')
      ) {
        this.getExternalExtensions();
      }
    });

    this.environmentsService.getEnvironments().subscribe(
      res => {
        this.environments = res;
        this.filteredEnvironments = res;
      },
      err => console.log(err)
    );
  }

  manageExternalViews(extensions, basePath, navigationContext) {
    const extViews = new Map();
    extensions.forEach(extension => {
      let category = 'External Views';
      if (
        !navigationContext ||
        (extension.spec.placement &&
          extension.spec.placement.split(',').includes(navigationContext))
      ) {
        if (extension.spec.navigationNodes) {
          extension.spec.navigationNodes.forEach(node => {
            const path = node.navigationPath.split('/');
            if (path.length === 1) {
              if (extension.spec.category) {
                category = extension.spec.category;
              }
              let extensionsCategories = extViews.get(category);
              if (!extensionsCategories) {
                extensionsCategories = [];
                extViews.set(category, extensionsCategories);
              }
              extensionsCategories.push(node);
            }
          });
        }
      }
    });

    extViews.forEach((nodes, category) => {
      nodes.forEach(node => {
        this.addEntryToNavigationGroup(category, {
          name: node.label,
          link: basePath + node.navigationPath.split('/')[0]
        });
      });
    });
  }

  getExtensions() {
    this.extensionsService
      .getExtensions(this.currentEnvironmentId)
      .subscribe(extensions => {
        this.manageExternalViews(extensions, 'extensions/', null);
      });
  }

  getExternalExtensions() {
    this.extensionsService
      .getExternalExtensions()
      .subscribe(clusterExtensions => {
        if (this.navCtx === 'settings') {
          this.manageExternalViews(
            clusterExtensions,
            '/home/settings/extensions/',
            'cluster'
          );
        }
        if (this.currentEnvironmentId) {
          this.manageExternalViews(
            clusterExtensions,
            'extensions/',
            'environment'
          );
        }
      });
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
      this.externalViewsGroups.push(group);
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
