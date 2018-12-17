import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CurrentEnvironmentService } from '../../../../environments/services/current-environment.service';
import { AppConfig } from '../../../../../app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';
import { InformationModalComponent } from '../../../../../shared/components/information-modal/information-modal.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-secret-detail',
  templateUrl: './secret-detail.component.html',
  styleUrls: ['./secret-detail.component.scss']
})
export class SecretDetailComponent implements OnInit, OnDestroy {
  public currentEnvironmentId = '';
  public secretName: string;
  public secretDetails: any;
  public data: any;
  public annotations: any;
  public loading = true;
  public errorMessage: string;
  public currentEnvironmentSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private currentEnvironmentService: CurrentEnvironmentService,
    private router: Router,
    private route: ActivatedRoute,
    private communicationService: ComponentCommunicationService
  ) {
    this.subscribeToRefreshComponent();
  }

  ngOnInit() {
    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        this.route.params.subscribe(params => {
          this.secretName = params['name'];
          const url = this.prepareUrl();
          this.fetchSecretDetails(url);
        });
      });
  }

  prepareUrl(): string {
    return `${AppConfig.k8sApiServerUrl}namespaces/${
      this.currentEnvironmentId
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
          this.router.navigate([
            `/home/namespaces/${this.currentEnvironmentId}/secrets`
          ]);
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

  goBack() {
    this.router.navigate([
      'home/namespaces/' + this.currentEnvironmentId + '/secrets'
    ]);
  }

  toggleSecret(secret) {
    secret.show = !secret.show;
  }

  annotationDetails(information: InformationModalComponent) {
    information.show();
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }
}
