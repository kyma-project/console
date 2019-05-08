import { AppConfig } from '../../../app.config';
import { ChangeDetectorRef, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { IdpPresetsHeaderRendererComponent } from './idp-presets-header-renderer/idp-presets-header-renderer.component';
import { IdpPresetsEntryRendererComponent } from './idp-presets-entry-renderer/idp-presets-entry-renderer.component';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Filter, GenericTableComponent } from 'app/generic-list';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { CreatePresetModalComponent } from './create-preset-modal/create-preset-modal.component';
import { IdpPresetsService } from './idp-presets.service';
import { GraphQLDataProvider } from '../../namespaces/operation/graphql-data-provider';
import * as _ from 'lodash';
import { IEmptyListData } from 'shared/datamodel';
import { AbstractKubernetesElementListComponent } from 'namespaces/operation/abstract-kubernetes-element-list.component';
import { HttpClient } from '@angular/common/http';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'app-idp-presets',
  templateUrl: './idp-presets.component.html'
})
export class IdpPresetsComponent extends AbstractKubernetesElementListComponent implements OnInit, OnDestroy {
  public title = 'IDP Presets';
  public emptyListData: IEmptyListData = this.getBasicEmptyListData(this.title, { headerTitle: true, namespaceSuffix: false });
  public createNewElementText = 'Add IDP Preset';
  public resourceKind = 'IDPPreset';
  public hideFilter = true;
  public entryEventHandler = this.getEntryEventHandler();

  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('createModal') createModal: CreatePresetModalComponent;

  constructor(
    private idpPresetsService: IdpPresetsService,
    private http: HttpClient,
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, http, commService);

    const query = `query IDPPresets {
      IDPPresets{
        name
        issuer
        jwksUri
      }
    }`;

    this.source = new GraphQLDataProvider(
      query,
      undefined,
      this.graphQLClientService
    );

    this.entryRenderer = IdpPresetsEntryRendererComponent;
    this.headerRenderer = IdpPresetsHeaderRendererComponent;
    this.filterState = {
      filters: [new Filter('name', '', false)]
    };
    this.pagingState = { pageNumber: 1, pageSize: 20 };
    this.idpPresetsService.idpChangeStateEmitter$.subscribe(() => {
      this.reload();
    });

    this.subscribeToRefreshComponent();
  }

  public ngOnInit() {
    super.ngOnInit();
    this.subscribeToRefreshComponent();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  public openModal() {
    this.createModal.show();
  }

  public getEntryEventHandler() {
    return {
      delete: (entry: any) => {
        this.confirmationModal
          .show(
            'Confirm delete',
            'Do you really want to delete ' + entry.name + '?'
          )
          .then(
            () => {
              this.idpPresetsService.deleteIdpPreset(entry.name).subscribe(
                res => {
                  const response: any = res;

                  this.commService.sendEvent({
                    type: 'deleteResource',
                    data: response.deleteIDPPreset
                  });
                },
                err => console.log(err)
              );
            },
            () => {}
          );
      }
    };
  }
}
