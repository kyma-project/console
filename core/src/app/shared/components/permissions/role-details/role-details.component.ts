import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from '../../../../app.config';
import { CurrentEnvironmentService } from '../../../../content/environments/services/current-environment.service';
import { finalize } from 'rxjs/operators';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  templateUrl: './role-details.component.html'
})
export class RoleDetailsComponent implements OnInit, OnDestroy {
  public coreGroup = '/api/v1';

  private currentEnvironmentSubscription: Subscription;
  private currentEnvironmentId: string;
  public roleName: string;
  public loading = true;
  public errorMessage: string;
  public roleDetails: object;
  public isGlobalMode: boolean;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  public ngOnInit() {
    this.route.data.subscribe(routeData => {
      this.isGlobalMode = routeData && routeData.global;

      if (!this.isGlobalMode) {
        this.currentEnvironmentSubscription = this.currentEnvironmentService
          .getCurrentEnvironmentId()
          .subscribe(envId => {
            this.currentEnvironmentId = envId;

            this.route.params.subscribe(params => {
              this.roleName = params['name'];
              const url = `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
                this.currentEnvironmentId
              }/roles/${this.roleName}`;
              this.fetchDetails(url);
            });
          });
      } else {
        this.route.params.subscribe(params => {
          this.roleName = params['name'];
          const url = `${AppConfig.k8sApiServerUrl_rbac}clusterroles/${
            this.roleName
          }`;
          this.fetchDetails(url);
        });
      }
    });
  }

  private navigateToList() {
    if (!this.isGlobalMode) {
      LuigiClient.linkManager()
        .fromContext('permissions')
        .navigate('');
    } else {
      LuigiClient.linkManager().navigate(`/home/settings/global-permissions`);
    }
  }

  public goBack() {
    this.location.back();
  }

  public ngOnDestroy() {
    if (this.currentEnvironmentSubscription) {
      this.currentEnvironmentSubscription.unsubscribe();
    }
  }

  private fetchDetails(url) {
    this.http
      .get(url)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        data => {
          this.roleDetails = data;
        },
        err => {
          this.errorMessage = err.message;
        }
      );
  }
}
