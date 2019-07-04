import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NamespaceInfo } from '../namespace-info';
import { ApplicationsService } from '../../settings/applications/services/applications.service';
import { CurrentNamespaceService } from '../services/current-namespace.service';
import { NamespacesService } from '../services/namespaces.service';
import { AppConfig } from '../../../app.config';
import { ResourceUploaderModalComponent } from '../../../shared/components/resource-uploader/resource-uploader-modal/resource-uploader-modal.component';
import { InformationModalComponent } from 'shared/components/information-modal/information-modal.component';
import { HttpClient } from '@angular/common/http';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Observable, of, Subscription } from 'rxjs';
import { ApplicationBindingService } from '../../settings/applications/application-details/application-binding-service';
import * as LuigiClient from '@kyma-project/luigi-client';
import { ConfirmationModalComponent } from 'shared/components/confirmation-modal/confirmation-modal.component';
import { NamespaceEditComponent } from '../namespace-edit/namespace-edit.component';

@Component({
  selector: 'app-namespace-details',
  templateUrl: './namespace-details.component.html',
  styleUrls: ['./namespace-details.component.scss']
})
export class NamespaceDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('editnamespacemodal')
  private editnamespacemodal: NamespaceEditComponent;
  @ViewChild('uploaderModal')
  private uploaderModal: ResourceUploaderModalComponent;
  @ViewChild('infoModal')
  private infoModal: InformationModalComponent;
  @ViewChild('confirmationModal')
  private confirmationModal: ConfirmationModalComponent;

  public namespace: NamespaceInfo = new NamespaceInfo({ uid: '', name: '' });
  public boundApplicationsCount: Observable<number> = of(0);
  public applications: any;
  public services: any;
  public errorMessage: string;
  public labelKeys: string[] = [];
  private id: string;
  private currentNamespaceSubscription: Subscription;
  private refreshComponentSubscription: Subscription;
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
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.id = namespaceId;
        this.getNamespace(this.id, () => {
          this.getServices(this.id);
          this.getApplications(this.id);
        })
      });
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
    if (this.refreshComponentSubscription) {
      this.refreshComponentSubscription.unsubscribe();
    }
  }

  private getApplications(id: string) {
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

  private getServices(id: string) {
    const url = `${AppConfig.k8sApiServerUrl}namespaces/${id}/services`;
    this.http.get<any>(url).subscribe(res => {
      this.services = res.items;
    });
  }

  private getNamespace(id: string, additionalCalls?: () => void) {
    this.namespacesService.getNamespace(this.id).subscribe(
      namespace => {
        if (namespace) {
          this.namespace = namespace;
        }
        if (this.namespace.getLabels() !== null && this.namespace.getLabels() !== undefined) {
          this.labelKeys = Object.keys(this.namespace.getLabels());
        }
        if (typeof additionalCalls === 'function') {
          additionalCalls();
        }
      },
      err => {
        this.errorMessage = err.message;
        console.log(`error loading namespace ${id}`, err);
      }
    );
  }

  private openUploadResourceModal() {
    this.uploaderModal.show();
  }

  openEditNamespaceModal() {
    this.editnamespacemodal.show(this.namespace);
  }

  private subscribeToRefreshComponent() {
    this.refreshComponentSubscription = this.communicationService.observable$.subscribe(e => {
      const event: any = e;

      if (event.type === 'createResource' || event.type === 'deleteResource') {
        this.getApplications(this.id);
        this.getServices(this.id);
      } else if (event.type === 'editLabel') {
        this.getNamespace(this.id);
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

  public navigateToApplications(applicationName = null) {
    LuigiClient.linkManager().navigate(
      applicationName ? '/home/cmf-apps/details/' + applicationName : '/home/cmf-apps'
    );
  }

  public deleteNamespace() {
    this.confirmationModal.show('Delete', `Do you want to delete namespace ${this.namespace.getLabel()}?`)
      .then(() => {
        this.namespacesService.deleteNamespace(this.namespace.getLabel())
          .subscribe(() => {
            LuigiClient.linkManager().navigate('/home');
          }, err => {
            this.infoModal.show('Error', `There was an error while deleting namespace ${this.namespace.getLabel()}: ${err}`)
          });
      })
      .catch(() => { });
  }

}
