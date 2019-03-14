import { EnvironmentDataConverter } from './environment-data-converter';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import { EnvironmentCardComponent } from './../environment-card/environment-card.component';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { KubernetesDataProvider } from '../../environments/operation/kubernetes-data-provider';
import {
  Environment,
  IEnvironment
} from '../../../shared/datamodel/k8s/environment';
import LuigiClient from '@kyma-project/luigi-client';
import { EnvironmentsService } from '../../../content/environments/services/environments.service';
import { DataConverter, Filter, GenericListComponent } from 'app/generic-list';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { ApplicationBindingService } from '../../settings/applications/application-details/application-binding-service';
import { InformationModalComponent } from '../../../shared/components/information-modal/information-modal.component';
import { EnvironmentCreateComponent } from '../../environments/environment-create/environment-create.component';

@Component({
  selector: 'app-workspace-overview',
  templateUrl: './workspace-overview.component.html'
})
export class WorkspaceOverviewComponent extends GenericListComponent
  implements OnInit, OnDestroy {
  environmentsService: EnvironmentsService;
  entryEventHandler = this.getEntryEventHandler();
  private queryParamsSubscription: any;
  private k8sNamespacesFilter = 'env=true';

  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;
  @ViewChild('createModal') createModal: EnvironmentCreateComponent;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    changeDetector: ChangeDetectorRef,
    @Inject(EnvironmentsService) environmentsService: EnvironmentsService,
    private communicationService: ComponentCommunicationService,
    private applicationBindingService: ApplicationBindingService
  ) {
    super(changeDetector);
    this.environmentsService = environmentsService;
    const converter: DataConverter<
      IEnvironment,
      Environment
    > = new EnvironmentDataConverter(applicationBindingService, http);
    const url = `${AppConfig.k8sApiServerUrl}namespaces?labelSelector`;
    this.source = new KubernetesDataProvider(url, converter, this.http);
    this.entryRenderer = EnvironmentCardComponent;
    this.filterState = {
      facets: [this.k8sNamespacesFilter],
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

  ngOnInit() {
    super.ngOnInit();
    this.queryParamsSubscription = this.route.queryParams.subscribe(params =>
      this.handleQueryParamsChange(params)
    );
  }
  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }
  onEnvCreateCancelled() {
    LuigiClient.linkManager().navigate('/');
  }
  handleQueryParamsChange(queryParams: any) {
    if (queryParams && queryParams.showModal === 'true') {
      this.createModal.show();
    }
    if (queryParams && queryParams.allNamespaces === 'true') {
      this.filterState.facets = this.filterState.facets.filter(
        elem => elem !== this.k8sNamespacesFilter
      );
      this.reload();
    }
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
                    this.router.navigateByUrl('/home/namespaces');
                  },
                  err => {
                    entry.disabled = false;
                    this.communicationService.sendEvent({
                      type: 'disable',
                      entry
                    });
                    this.infoModal.show(
                      'Error',
                      'There was an error trying to delete namespace ' +
                        (entry.name || entry.getName()) +
                        ': ' +
                        (err.error.message || err.message || err)
                    );
                  },
                  () => {
                    this.confirmationModal.cancel();
                    this.refreshContextSwitcher();
                  }
                );
            },
            () => {}
          );
      }
    };
  }

  private refreshContextSwitcher() {
    window.parent.postMessage({ msg: 'luigi.refresh-context-switcher' }, '*');
  }
}
