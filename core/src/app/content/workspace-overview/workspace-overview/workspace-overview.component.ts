import { NamespaceDataConverter } from './namespace-data-converter';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  ViewChild,
  OnInit,
  OnDestroy
} from '@angular/core';
import { NamespaceCardComponent } from '../namespace-card/namespace-card.component';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../../app.config';
import { KubernetesDataProvider } from '../../namespaces/operation/kubernetes-data-provider';
import {
  Namespace,
  INamespace
} from '../../../shared/datamodel/k8s/namespace';
import LuigiClient from '@kyma-project/luigi-client';
import { NamespacesService } from '../../namespaces/services/namespaces.service';
import { DataConverter, Filter, GenericListComponent } from 'app/generic-list';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { ApplicationBindingService } from '../../settings/applications/application-details/application-binding-service';
import { InformationModalComponent } from '../../../shared/components/information-modal/information-modal.component';
import { NamespaceCreateComponent } from '../../namespaces/namespace-create/namespace-create.component';

@Component({
  selector: 'app-workspace-overview',
  templateUrl: './workspace-overview.component.html'
})
export class WorkspaceOverviewComponent extends GenericListComponent
  implements OnInit, OnDestroy {
  namespacesService: NamespacesService;
  entryEventHandler = this.getEntryEventHandler();
  private queryParamsSubscription: any;

  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;
  @ViewChild('createModal') createModal: NamespaceCreateComponent;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    changeDetector: ChangeDetectorRef,
    @Inject(NamespacesService) namespacesService: NamespacesService,
    private communicationService: ComponentCommunicationService,
    private applicationBindingService: ApplicationBindingService
  ) {
    super(changeDetector);

    this.allowStoringFilters = true;
    this.localStorageKey = 'workspace/namespaceFilters';

    this.namespacesService = namespacesService;
    const converter: DataConverter<
      INamespace,
      Namespace
    > = new NamespaceDataConverter(applicationBindingService, http);
    const url = `${AppConfig.k8sApiServerUrl}namespaces?labelSelector`;
    this.source = new KubernetesDataProvider(url, converter, this.http);
    this.entryRenderer = NamespaceCardComponent;
    this.filterState = {
      filters: [
        new Filter('metadata.name', '', false),
        new Filter('metadata.uid', '', false)
      ]
    };
    this.pagingState = { pageNumber: 1, pageSize: 20 };
    this.namespacesService.namespaceChangeStateEmitter$.subscribe(() => {
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
  onNamespaceCreateCancelled() {
    LuigiClient.linkManager().navigate('/');
  }
  handleQueryParamsChange(queryParams: any) {
    if (queryParams && queryParams.showModal === 'true') {
      this.createModal.show();
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
              this.namespacesService
                .deleteNamespace(entry.getName())
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
