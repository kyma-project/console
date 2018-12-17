import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EnvironmentInfo } from '../../environments/environment-info';
import { RemoteEnvironmentsService } from '../../settings/remote-environments/services/remote-environments.service';
import { CurrentEnvironmentService } from '../../environments/services/current-environment.service';
import { EnvironmentsService } from '../../environments/services/environments.service';
import { AppConfig } from '../../../app.config';
import { ResourceUploaderModalComponent } from '../../../shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';
import { EnvironmentCreateComponent } from '../environment-create/environment-create.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Observable, of, Subscription } from 'rxjs';
import { RemoteEnvironmentBindingService } from '../../settings/remote-environments/remote-environment-details/remote-environment-binding-service';

@Component({
  selector: 'app-environment-details',
  templateUrl: './environment-details.component.html',
  styleUrls: ['./environment-details.component.scss'],
  host: { class: 'sf-content' }
})
export class EnvironmentDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('uploaderModal')
  private uploaderModal: ResourceUploaderModalComponent;
  @ViewChild('createmodal') private createmodal: EnvironmentCreateComponent;
  private orgName = AppConfig.orgName;
  public environment: EnvironmentInfo = new EnvironmentInfo('', '');
  private boundRemoteEnvironmentsCount: Observable<number> = of(0);
  private remoteEnvironments: any;
  private services: any;
  public errorMessage: string;
  private id: string;
  private currentEnvironmentSubscription: Subscription;
  private actions = [
    {
      function: 'unbind',
      name: 'Unbind'
    }
  ];
  entryEventHandler = this.getEntryEventHandler();

  constructor(
    private http: HttpClient,
    private router: Router,
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private environmentsService: EnvironmentsService,
    private currentEnvironmentService: CurrentEnvironmentService,
    private communicationService: ComponentCommunicationService,
    private remoteEnvBindingService: RemoteEnvironmentBindingService
  ) {
    this.subscribeToRefreshComponent();
  }

  public ngOnInit() {
    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.id = envId;
        this.environmentsService.getEnvironment(this.id).subscribe(
          env => {
            if (env) {
              this.environment = env;
            }
            this.getRemoteEnvs(this.id);
            this.getServices(this.id);
          },
          err => {
            this.errorMessage = err.message;
            console.log(`error loading namespace ${envId}`, err);
          }
        );
      });
  }

  public ngOnDestroy() {
    if (this.currentEnvironmentSubscription) {
      this.currentEnvironmentSubscription.unsubscribe();
    }
  }

  private getRemoteEnvs(id) {
    this.remoteEnvBindingService.getBoundRemoteEnvironments(id).subscribe(
      res => {
        this.remoteEnvironments = res['remoteEnvironments'];
        this.boundRemoteEnvironmentsCount = of(
          this.remoteEnvironments ? this.remoteEnvironments.length : 0
        );
      },
      err => console.log(err)
    );
  }

  private getServices(id) {
    const url = `${AppConfig.k8sApiServerUrl}namespaces/${id}/services`;
    this.http.get<any>(url).subscribe(res => {
      this.services = res.items;
    });
  }

  private openUploadResourceModal() {
    this.uploaderModal.show();
  }

  private subscribeToRefreshComponent() {
    this.communicationService.observable$.subscribe(e => {
      const event: any = e;

      if (event.type === 'createResource' || event.type === 'deleteResource') {
        this.getRemoteEnvs(this.id);
        this.getServices(this.id);
      }
    });
  }

  getEntryEventHandler() {
    return {
      unbind: (entry: any) => {
        this.remoteEnvBindingService.unbind(this.id, entry.name).subscribe(
          res => {
            this.getRemoteEnvs(this.id);
          },
          err => console.log(err)
        );
      }
    };
  }
}
