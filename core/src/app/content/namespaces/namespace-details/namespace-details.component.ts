import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NamespaceInfo } from '../namespace-info';
import { ApplicationsService } from '../../settings/applications/services/applications.service';
import { CurrentNamespaceService } from '../services/current-namespace.service';
import { NamespacesService } from '../services/namespaces.service';
import { AppConfig } from '../../../app.config';
import { ResourceUploaderModalComponent } from '../../../shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';
import { NamespaceCreateComponent } from '../namespace-create/namespace-create.component';
import { HttpClient } from '@angular/common/http';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Observable, of, Subscription } from 'rxjs';
import { ApplicationBindingService } from '../../settings/applications/application-details/application-binding-service';
import * as LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-namespace-details',
  templateUrl: './namespace-details.component.html',
  styleUrls: ['./namespace-details.component.scss']
})
export class NamespaceDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('uploaderModal')
  private uploaderModal: ResourceUploaderModalComponent;
  @ViewChild('createmodal') private createmodal: NamespaceCreateComponent;
  private orgName = AppConfig.orgName;
  public namespace: NamespaceInfo = new NamespaceInfo('', '');
  private boundApplicationsCount: Observable<number> = of(0);
  public applications: any;
  private services: any;
  public errorMessage: string;
  private id: string;
  private isSystemNamespace: boolean;
  private currentNamespaceSubscription: Subscription;
  private actions = [
    {
      function: 'unbind',
      name: 'Unbind'
    }
  ];
  entryEventHandler = this.getEntryEventHandler();

  constructor(
    private http: HttpClient,
    private applicationsService: ApplicationsService,
    private namespacesService: NamespacesService,
    private currentNamespaceService: CurrentNamespaceService,
    private communicationService: ComponentCommunicationService,
    private applicationBindingService: ApplicationBindingService
  ) {
    this.subscribeToRefreshComponent();
  }

  public ngOnInit() {
    this.isSystemNamespace = LuigiClient.getEventData().isSystemNamespace;
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.id = namespaceId;
        this.namespacesService.getNamespace(this.id).subscribe(
          namespace => {
            if (namespace) {
              this.namespace = namespace;
            }
            if (!this.isSystemNamespace) {
              this.getApplications(this.id);
            }
            this.getServices(this.id);
          },
          err => {
            this.errorMessage = err.message;
            console.log(`error loading namespace ${namespaceId}`, err);
          }
        );
      });
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
  }

  private getApplications(id) {
    this.applicationBindingService.getBoundApplications(id).subscribe(
      res => {
        this.applications = res['applications'];
        this.boundApplicationsCount = of(
          this.applications ? this.applications.length : 0
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
        this.getApplications(this.id);
        this.getServices(this.id);
      }
    });
  }

  getEntryEventHandler() {
    return {
      unbind: (entry: any) => {
        this.applicationBindingService.unbind(this.id, entry.name).subscribe(
          res => {
            this.getApplications(this.id);
          },
          err => console.log(err)
        );
      }
    };
  }

  public navigateToServices() {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate('services');
  }

  public navigateToApplications(namespaceName) {
    LuigiClient.linkManager().navigate(
      namespaceName ? '/home/cmf-apps/details/' + namespaceName : '/home/cmf-apps'
    );
  }
}
