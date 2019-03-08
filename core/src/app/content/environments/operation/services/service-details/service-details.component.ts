import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../../../app.config';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { CurrentEnvironmentService } from '../../../../environments/services/current-environment.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-service-details',
  styleUrls: ['./service-details.component.scss'],
  templateUrl: './service-details.component.html'
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {
  public currentEnvironmentId = '';
  public errorMessage: string;
  public serviceName: string;
  public serviceDetails: any;
  public serviceDetailsLoading = true;
  public serviceDetailsUrl: string;
  public currentEnvironmentSubscription: Subscription;
  public isSystemNamespace: boolean;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private route: ActivatedRoute,
    private communicationService: ComponentCommunicationService
  ) {
    this.subscribeToRefreshComponent();
  }

  public ngOnInit() {
    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;

        this.route.params.subscribe(params => {
          this.serviceName = params['name'];

          this.serviceDetailsUrl = `${AppConfig.k8sApiServerUrl}namespaces/${
            this.currentEnvironmentId
          }/services/${this.serviceName}`;

          this.fetchData(this.serviceDetailsUrl).subscribe(
            res => {
              this.serviceDetails = res;
              this.serviceDetailsLoading = false;
            },
            err => {
              if (err.status === 404) {
                this.navigateToList();
              } else {
                this.serviceDetailsLoading = false;
                this.errorMessage = err.message;
              }
            }
          );
        });
      });
    this.isSystemNamespace = LuigiClient.getEventData().isSystemNamespace;
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }

  public subscribeToRefreshComponent() {
    this.communicationService.observable$.subscribe(e => {
      const event: any = e;

      if ('updateResource' === event.type && 'Service' === event.data.kind) {
        this.fetchData(this.serviceDetailsUrl).subscribe(res => {
          this.serviceDetails = res;
        });
      }
    });
  }

  private fetchData(url) {
    return this.http.get<any>(url, {});
  }

  private objectKeys(o) {
    return Object.keys(o);
  }

  public openExposeApi() {
    LuigiClient.linkManager().navigate(`apis/create`);
  }

  public navigateToList() {
    LuigiClient.linkManager()
      .fromContext('services')
      .navigate('');
  }
}
