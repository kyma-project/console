import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrentNamespaceService } from '../../../services/current-namespace.service';
import { AppConfig } from '../../../../../app.config';
import { ActivatedRoute } from '@angular/router';
import { InformationModalComponent } from '../../../../../shared/components/information-modal/information-modal.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-secret-detail',
  templateUrl: './secret-detail.component.html',
  styleUrls: ['./secret-detail.component.scss']
})
export class SecretDetailComponent implements OnInit, OnDestroy {
  public currentNamespaceId = '';
  public secretName: string;
  public secretDetails: any;
  public data: any;
  public annotations: any;
  public loading = true;
  public errorMessage: string;
  public currentNamespaceSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private route: ActivatedRoute,
    private communicationService: ComponentCommunicationService
  ) {
    this.subscribeToRefreshComponent();
  }

  ngOnInit() {
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
        this.route.params.subscribe(params => {
          this.secretName = params['name'];
          const url = this.prepareUrl();
          this.fetchSecretDetails(url);
        });
      });
  }

  prepareUrl(): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentNamespaceId
    }/secrets/${this.secretName}`;
  }

  fetchSecretDetails(url) {
    this.http.get<any>(url).subscribe(
      res => {
        const data = this.prepareData(res.data);
        const annotations = this.prepareAnnotations(res.metadata.annotations);

        this.displayDetails(data, annotations, res);
        this.loading = false;
      },
      err => {
        if (err.status === 404) {
          this.navigateToList();
        } else {
          this.loading = false;
          this.errorMessage = err.message;
        }
      }
    );
  }

  prepareData(responseData: any) {
    const data = [];

    Object.keys(responseData).forEach(key => {
      const element = {
        name: key,
        value: responseData[key],
        length: responseData[key].length,
        show: false
      };
      data.push(element);
    });

    return data;
  }

  prepareAnnotations(annotationsArray: any[]) {
    const annotations = [];
    if (annotationsArray) {
      Object.keys(annotationsArray).forEach(key => {
        const element = {
          name: key,
          value: annotationsArray[key]
        };
        annotations.push(element);
      });
      return annotations;
    }
    return null;
  }

  displayDetails(data, annotations, res) {
    this.data = data;
    this.annotations = annotations;
    this.secretDetails = res;
  }

  subscribeToRefreshComponent() {
    this.communicationService.observable$.subscribe(e => {
      const event: any = e;

      if ('updateResource' === event.type && 'Secret' === event.data.kind) {
        const data = this.prepareData(event.data.data);
        const annotations = this.prepareAnnotations(
          event.data.metadata.annotations
        );

        this.displayDetails(data, annotations, event.data);
      }
    });
  }

  public navigateToList() {
    LuigiClient.linkManager()
      .fromContext('secrets')
      .navigate('');
  }

  toggleSecret(secret) {
    secret.show = !secret.show;
  }

  annotationDetails(information: InformationModalComponent) {
    information.show();
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
  }
}
