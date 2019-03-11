import { AppConfig } from '../../../app.config';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IdpPresetsHeaderRendererComponent } from './idp-presets-header-renderer/idp-presets-header-renderer.component';
import { IdpPresetsEntryRendererComponent } from './idp-presets-entry-renderer/idp-presets-entry-renderer.component';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { Filter, GenericTableComponent } from 'app/generic-list';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { CreatePresetModalComponent } from './create-preset-modal/create-preset-modal.component';
import { IdpPresetsService } from './idp-presets.service';
import { GraphQLDataProvider } from '../../environments/operation/graphql-data-provider';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';
import * as _ from 'lodash';

@Component({
  selector: 'app-idp-presets',
  templateUrl: './idp-presets.component.html'
})
export class IdpPresetsComponent extends GenericTableComponent {
  public title = 'IDP Presets';
  public emptyListText = 'It looks like you don’t have any IDP presets yet.';
  public createNewElementText = 'Add IDP Preset';
  public resourceKind = 'IDPPreset';
  public hideFilter = true;
  public entryEventHandler = this.getEntryEventHandler();

  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('createModal') createModal: CreatePresetModalComponent;

  constructor(
    private idpPresetsService: IdpPresetsService,
    private graphQLClientService: GraphQLClientService,
    private communicationService: ComponentCommunicationService,
    changeDetector: ChangeDetectorRef
  ) {
    super(changeDetector);
    const query = `query {
      IDPPresets{
        name
        issuer
        jwksUri
      }
    }`;

    this.source = new GraphQLDataProvider(
      AppConfig.graphqlApiUrl,
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

  private subscribeToRefreshComponent() {
    this.communicationService.observable$.subscribe(e => {
      const event: any = e;

      if (
        (event.type === 'createResource' && !_.isEmpty(event.data)) ||
        (event.type === 'deleteResource' && !_.isEmpty(event.data))
      ) {
        this.reload();
      }
    });
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

                  this.communicationService.sendEvent({
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
