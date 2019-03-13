import { refCount, publishReplay, map, catchError } from 'rxjs/operators';
import { of as observableOf, Observable, forkJoin } from 'rxjs';

import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { IFunction, Lambda } from './../../shared/datamodel/k8s/function';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Filter, GenericTableComponent, DataConverter } from 'app/generic-list';

import { LambdasEntryRendererComponent } from './lambdas-entry-renderer/lambdas-entry-renderer.component';
import { LambdasHeaderRendererComponent } from './lambdas-header-renderer/lambdas-header-renderer.component';
import { KubernetesDataProvider } from '../../shared/data-provider/kubernetes-data-provider';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { DeploymentDetailsService } from './deployment-details.service';

import { AppConfig } from '../../app.config';
import { ApisService } from '../../apis/apis.service';
import { ServiceBindingUsagesService } from '../../service-binding-usages/service-binding-usages.service';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { Subscription } from '../../shared/datamodel/k8s/subscription';

import * as luigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-lambdas',
  templateUrl: './lambdas.component.html',
  styleUrls: ['./lambdas.component.scss'],
})
export class LambdasComponent extends GenericTableComponent
  implements OnInit, OnDestroy {
  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('errorAlert') errorAlert;
  title = 'Lambdas';
  public lambdasEmptyListData = {
    header: {
      text: 'Bound Lambdas'
      // ,
      // actionButton: { text: 'Add Lambda', glyph: 'add' }
    },
    body: {
      text: 'It looks like you don’t have any lambdas in your namespace yet.',
    }
  };

  public lambdasEventHandler;
  token: string;
  environment: string;
  error: string;
  listenerId: string;

  filterState = { filters: [new Filter('metadata.name', '', false)] };
  pagingState = { pageNumber: 1, pageSize: 10 };

  lambdasEntryRenderer = LambdasEntryRendererComponent;
  lambdasHeaderRenderer = LambdasHeaderRendererComponent;

  constructor(
    private http: HttpClient,
    private deploymentDetailsService: DeploymentDetailsService,
    changeDetector: ChangeDetectorRef,
    private apisService: ApisService,
    private subscriptionsService: SubscriptionsService,
    private serviceBindingUsagesService: ServiceBindingUsagesService,
  ) {
    super(changeDetector);

    this.lambdasEventHandler = {
      delete: (entry: any) => {
        this.confirmationModal
          .show(
            'Confirm delete',
            `Do you really want to delete ${entry.metadata.name}?`,
          )
          .then(() => {
            this.http
              .delete(
                `${AppConfig.kubelessApiUrl}/namespaces/${
                  this.environment
                }/functions/${entry.metadata.name}`,
                {
                  headers: new HttpHeaders().set(
                    'Authorization',
                    `Bearer ${this.token}`,
                  ),
                },
              )
              .subscribe(
                () => {
                  setTimeout(() => {
                    this.deleteSubscriptions(entry.metadata.name);
                    this.deleteServiceBindingUsages(entry.metadata.name);
                    this.apisService
                      .getApi(entry.metadata.name, this.environment, this.token)
                      .subscribe(
                        () => {
                          this.apisService
                            .deleteApi(
                              entry.metadata.name,
                              this.environment,
                              this.token,
                            )
                            .subscribe(
                              () => {},
                              err => {
                                this.showError(err.message);
                              },
                            );
                        },
                        err => {
                          // HTTP 404 is valid when there are no APIs
                        },
                      );
                    this.reload();
                  }, 500);
                },
                err => {
                  this.reload();
                  this.showError(err.message);
                },
              );
          });
      },
    };
  }

  deleteSubscriptions(lambdaName: string): void {
    const deleteSubReqs: Array<Observable<Subscription>> = [];
    this.subscriptionsService
      .getSubscriptions(this.environment, this.token, {
        labelSelector: `Function=${lambdaName}`,
      })
      .subscribe(subs => {
        subs.items.forEach(item => {
          deleteSubReqs.push(
            this.subscriptionsService
              .deleteSubscription(
                item.metadata.name,
                this.environment,
                this.token,
              )
              .pipe(
                catchError(err => {
                  return observableOf(err);
                }),
              ),
          );
        });

        forkJoin(deleteSubReqs).subscribe(responses => {
          responses.forEach(resp => {
            if (resp instanceof HttpErrorResponse) {
              this.showError((resp as HttpErrorResponse).message);
            }
          });
        });
      });
  }

  deleteServiceBindingUsages(lambdaName: string): void {
    // Get all servicebindingsusages which matches "lambda-<function name>-"
    // Create delete requests and populate in deleteRequests
    const deleteRequests = [];
    this.serviceBindingUsagesService
      .getServiceBindingUsages(this.environment, this.token, {
        labelSelector: `Function=${lambdaName}`,
      })
      .subscribe(sbuList => {
        sbuList.items.forEach(sbu => {
          deleteRequests.push(
            this.serviceBindingUsagesService
              .deleteServiceBindingUsage(
                sbu.metadata.name,
                this.environment,
                this.token,
              )
              .pipe(
                catchError(err => {
                  return observableOf(err);
                }),
              ),
          );
        });
        forkJoin(deleteRequests).subscribe(responses => {
          responses.forEach(resp => {
            if (resp instanceof HttpErrorResponse) {
              this.showError((resp as HttpErrorResponse).message);
            }
          });
        });
      });
  }

  ngOnInit() {
    this.listeningForChangingTitle();
  }

  ngOnDestroy() {
    if (this.listenerId) {
      luigiClient.removeInitListener(this.listenerId);
    }
  }

  showError(error: string): void {
    this.error = error;
  }

  listeningForChangingTitle() {
    // tslint:disable-next-line:no-this-assignment
    const that: LambdasComponent = this;
    const converter: DataConverter<IFunction, Lambda> = {
      convert(entry: IFunction) {
        const func = new Lambda(entry);
        func.functionStatus = that.deploymentDetailsService
          .getDeployments(func.getName(), that.environment, that.token)
          .pipe(
            map(deploymentList => {
              return deploymentList.items[0].status;
            }),
            catchError(() => {
              return observableOf(0);
            }),
          )
          .pipe(
            publishReplay(1),
            refCount(),
          );
        return func;
      },
    };

    this.listenerId = luigiClient.addInitListener(() => {
      const eventData = luigiClient.getEventData();
      this.environment = eventData.environmentId;
      this.token = eventData.idToken;
      this.source = new KubernetesDataProvider(
        `${AppConfig.kubelessApiUrl}/namespaces/${this.environment}/functions`,
        converter,
        this.http,
        this.token,
      );
      this.reload();
    });
  }

  goToCreate() {
    luigiClient.linkManager().navigate(`create`);
  }
}
