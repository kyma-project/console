import { EnvironmentDataConverter } from './environment-data-converter';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { EnvironmentCardComponent } from './../environment-card/environment-card.component';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { KubernetesDataProvider } from '../../environments/operation/kubernetes-data-provider';
import {
  Environment,
  IEnvironment
} from '../../../shared/datamodel/k8s/environment';
import { RemoteEnvironmentsService } from '../../settings/remote-environments/services/remote-environments.service';
import { EnvironmentsService } from '../../../content/environments/services/environments.service';
import {
  DataConverter,
  Filter,
  GenericListComponent
} from '@kyma-project/y-generic-list';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { RemoteEnvironmentBindingService } from '../../settings/remote-environments/remote-environment-details/remote-environment-binding-service';
import { InformationModalComponent } from '../../../shared/components/information-modal/information-modal.component';

@Component({
  selector: 'app-workspace-overview',
  templateUrl: './workspace-overview.component.html',
  styleUrls: ['./workspace-overview.component.scss'],
  host: { class: 'sf-content' }
})
export class WorkspaceOverviewComponent extends GenericListComponent {
  environmentsService: EnvironmentsService;

  entryEventHandler = this.getEntryEventHandler();

  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;

  constructor(
    private http: HttpClient,
    private remoteEnvironmentsService: RemoteEnvironmentsService,
    private router: Router,
    changeDetector: ChangeDetectorRef,
    @Inject(EnvironmentsService) environmentsService: EnvironmentsService,
    private communicationService: ComponentCommunicationService,
    private remoteEnvBindingService: RemoteEnvironmentBindingService
  ) {
    super(changeDetector);
    this.environmentsService = environmentsService;
    const converter: DataConverter<
      IEnvironment,
      Environment
    > = new EnvironmentDataConverter(remoteEnvBindingService, http);
    const url = `${AppConfig.k8sApiServerUrl}namespaces?labelSelector=env=true`;
    this.source = new KubernetesDataProvider(url, converter, this.http);
    this.entryRenderer = EnvironmentCardComponent;
    this.filterState = {
      filters: [
        new Filter('metadata.name', '', false),
        new Filter('metadata.uid', '', false)
      ]
    };
    this.pagingState = { pageNumber: 1, pageSize: 20 };
    this.environmentsService.envChangeStateEmitter$.subscribe(() => {
      this.reload();
    });
  }

  getEntryEventHandler() {
    return {
      delete: (entry: any) => {
        this.confirmationModal
          .show(
            'Confirm delete',
            'Do you really want to delete ' + entry.getName() + '?'
          )
          .then(
            () => {
              entry.disabled = true;
              this.communicationService.sendEvent({
                type: 'disable',
                entry
              });
              this.environmentsService
                .deleteEnvironment(entry.getName())
                .subscribe(
                  () => {
                    this.communicationService.sendEvent({
                      type: 'deleteResource',
                      data: entry
                    });
                    this.router.navigateByUrl('/home/environments');
                  },
                  err => {
                    entry.disabled = false;
                    this.communicationService.sendEvent({
                      type: 'disable',
                      entry
                    });
                    this.infoModal.show(
                      'Error',
                      'There was an error trying to delete environment ' +
                        (entry.name || entry.getName()) +
                        ': ' +
                        (err.error.message || err.message || err)
                    );
                  }
                );
            },
            () => {}
          );
      }
    };
  }
}
