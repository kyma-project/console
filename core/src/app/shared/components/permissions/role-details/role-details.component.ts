import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppConfig } from '../../../../app.config';
import { CurrentNamespaceService } from '../../../../content/namespaces/services/current-namespace.service';
import { finalize } from 'rxjs/operators';
import LuigiClient from '@kyma-project/luigi-client';
import { EMPTY_TEXT} from 'shared/constants/constants';

@Component({
  templateUrl: './role-details.component.html'
})
export class RoleDetailsComponent implements OnInit, OnDestroy {
  public coreGroup = '/api/v1';

  private currentNamespaceSubscription: Subscription;
  private currentNamespaceId: string;

  public roleName: string;
  public loading = true;
  public errorMessage: string;
  public roleDetails: object;
  public isGlobalMode: boolean;
  public emptyText = EMPTY_TEXT;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  public ngOnInit() {
    this.route.data.subscribe(routeData => {
      this.isGlobalMode = routeData && routeData.global;

      if (!this.isGlobalMode) {
        this.currentNamespaceSubscription = this.currentNamespaceService
          .getCurrentNamespaceId()
          .subscribe(namespaceId => {
            this.currentNamespaceId = namespaceId;

            this.route.params.subscribe(params => {
              this.roleName = params['name'];
              const url = `${AppConfig.k8sApiServerUrl_rbac}namespaces/${
                this.currentNamespaceId
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

  public navigateToList() {
    if (!this.isGlobalMode) {
      LuigiClient.linkManager()
        .fromContext('permissions')
        .navigate('');
    } else {
      LuigiClient.linkManager().navigate(`/home/global-permissions`);
    }
  }

  public goBack() {
    this.location.back();
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
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
