import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../../../app.config';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { CurrentNamespaceService } from '../../../services/current-namespace.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-service-details',
  styleUrls: ['./service-details.component.scss'],
  templateUrl: './service-details.component.html'
})
export class ServiceDetailsComponent implements OnInit, OnDestroy {
  public currentNamespaceId = '';
  public errorMessage: string;
  public serviceName: string;
  public serviceDetails: any;
  public serviceDetailsLoading = true;
  public serviceDetailsUrl: string;
  public currentNamespaceSubscription: Subscription;
  public isSystemNamespace: boolean;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private route: ActivatedRoute,
    private communicationService: ComponentCommunicationService
  ) {
    this.subscribeToRefreshComponent();
  }

  public ngOnInit() {
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;

        this.route.params.subscribe(params => {
          this.serviceName = params['name'];

          this.serviceDetailsUrl = `${AppConfig.k8sApiServerUrl}namespaces/${
            this.currentNamespaceId
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
    this.currentNamespaceSubscription.unsubscribe();
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
