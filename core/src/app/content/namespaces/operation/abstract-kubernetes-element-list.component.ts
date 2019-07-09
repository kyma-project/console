import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { InformationModalComponent } from '../../../shared/components/information-modal/information-modal.component';
import { JsonEditorModalComponent } from '../../../shared/components/json-editor-modal/json-editor-modal.component';
import { ComponentCommunicationService } from '../../../shared/services/component-communication.service';
import { CurrentNamespaceService } from '../services/current-namespace.service';
import {
  ChangeDetectorRef,
  Injectable,
  ViewChild,
  OnDestroy,
  Component
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Filter, GenericTableComponent } from 'app/generic-list';
import { Subscription, of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IEmptyListData, IEmptyListDataBody, IEmptyListDataHeader } from 'shared/datamodel';

@Injectable()
@Component({
  selector: 'abstract-kubernetes-element-list',
  templateUrl: './kubernetes-element-list.component.html'
})
export class AbstractKubernetesElementListComponent
  extends GenericTableComponent
  implements OnDestroy {
  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('infoModal') infoModal: InformationModalComponent;
  @ViewChild('editResourceModal') editResourceModal: JsonEditorModalComponent;

  hideFilter = false;
  showSelectFileButton = false;
  showSuccessInfo = false;
  filterState = {
    filters: [new Filter('metadata.name', '', false)]
  };
  pagingState = { pageNumber: 1, pageSize: 50 };
  entryEventHandler = this.getEntryEventHandler();

  public resourceKind: string;
  public title: string;
  public emptyListData: IEmptyListData;
  public createNewElementText: string;
  private communicationServiceSubscription: Subscription;

  constructor(
    private currentNamespaceSrv: CurrentNamespaceService,
    private changeDet: ChangeDetectorRef,
    private httpClient: HttpClient,
    private communicationService: ComponentCommunicationService
  ) {
    super(changeDet);
  }

  protected reloadResults() {
    of(0)
      .pipe(delay(350))
      .subscribe(() => {
        if (!this.loaded) {
          this.setLoading(true);
        }
      });

    if (!this.pagingState) {
      this.pagingState = {
        pageNumber: 1,
        pageSize: 16,
        totalCount: 0,
      };
    }
    if (!this.filterState) {
      this.filterState = {
        filters: [],
        facets: [],
      };
    }

    if (this.source) {
      this.data = new Observable(observer => {
        this.fetchData(observer, true, 2);
      });
      this.setLoaded(false);
    } else {
      this.data = null;
      this.setLoaded(true);
    }
  }

  protected getBasicEmptyListData(resource: string, { headerTitle, namespaceSuffix } = { headerTitle: true, namespaceSuffix: true }): IEmptyListData {
    const newBodyTextSuffix = namespaceSuffix ? 'in your namespace yet' : 'yet';
    const body: IEmptyListDataBody = {
      body: {
        text: `It looks like you don’t have any ${resource} ${newBodyTextSuffix}.`
      }
    };
    const header: IEmptyListDataHeader = headerTitle ? { header : { text: resource }} : {};
    return {...body, ...header}
  }

  getResourceUrl(kind: string, entry: any): string {
    return null;
  }

  navigateToDetails(entry: any) {
    // to be implemented by sub-class
  }

  getCurrentNamespaceId() {
    return this.currentNamespaceSrv.getCurrentNamespaceId();
  }

  ngOnDestroy() {
    if (this.communicationServiceSubscription) {
      this.communicationServiceSubscription.unsubscribe();
    }
  }

  getEntryEventHandler(): any {
    return {
      delete: (entry: any) => {
        this.confirmationModal
          .show(
            'Confirm delete',
            'Do you really want to delete ' +
              (entry.name || entry.getName()) +
              '?'
          )
          .then(
            () => {
              entry.disabled = true;
              this.communicationService.sendEvent({
                type: 'disable',
                entry
              });
              this.sendDeleteRequest(entry).subscribe(
                () => {
                  setTimeout(() => {
                    this.communicationService.sendEvent({
                      type: 'deleteResource',
                      data: entry
                    });
                  }, 275);
                },
                error => {
                  entry.disabled = false;
                  this.communicationService.sendEvent({
                    type: 'disable',
                    entry
                  });
                  this.infoModal.show(
                    'Error',
                    'There was an error trying to delete ' +
                      (entry.name || entry.getName()) +
                      ': ' +
                      (error.message || error)
                  );
                  this.reload();
                }
              );
            },
            () => {}
          );
      },
      edit: (entry: any) => {
        this.editEntryEventCallback(entry);
      },
      details: (entry: any) => {
        this.navigateToDetails(entry);
      }
    };
  }

  sendDeleteRequest(entry): Observable<any> {
    return this.httpClient.delete(
      this.getResourceUrl(this.resourceKind.toLowerCase(), entry)
    );
  }

  editEntryEventCallback(entry) {
    this.httpClient
      .get(this.getResourceUrl(this.resourceKind.toLowerCase(), entry))
      .subscribe(
        res => {
          this.editResourceModal.resourceData = res;
          this.editResourceModal.show();
        },
        error => {
          console.log('Error loading resource: ' + (error.message || error));
        }
      );
  }

  subscribeToRefreshComponent() {
    this.communicationServiceSubscription = this.communicationService.observable$.subscribe(
      e => {
        const event: any = e;

        switch (event.type) {
          case 'updateResource':
            return this.reload();
          case 'createResource':
            this.showSuccessInfo = true;
            return this.reload();
          case 'disable':
            return;
          default:
            this.reload();
        }
      }
    );
  }
}
