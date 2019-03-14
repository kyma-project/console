import {
  Component,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { AbstractKubernetesElementListComponent } from './abstract-kubernetes-element-list.component';
import { GraphqlMutatorModalComponent } from 'shared/components/json-editor-modal/graphql-mutator-modal.component';
import { CurrentEnvironmentService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { Filter } from 'app/generic-list';
import { Subscription } from 'rxjs';
import { GraphQLDataProvider } from './graphql-data-provider';
import { AppConfig } from 'app/app.config';

@Component({
  selector: 'abstract-graphql-element-list',
  templateUrl: './kubernetes-element-list.component.html'
})
export class AbstractGraphqlElementListComponent
  extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  private currentEnvironmentId: string;
  private currentEnvironmentSubscription: Subscription;
  public hideFilter = false;

  @ViewChild('mutateResourceModal')
  mutateResourceModal: GraphqlMutatorModalComponent;

  filterState = {
    filters: [new Filter('name', '', false)]
  };

  constructor(
    private currentEnvironmentService: CurrentEnvironmentService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentEnvironmentService, changeDetector, null, commService);

    this.currentEnvironmentSubscription = this.currentEnvironmentService
      .getCurrentEnvironmentId()
      .subscribe(envId => {
        this.currentEnvironmentId = envId;
        this.source = new GraphQLDataProvider(
          AppConfig.graphqlApiUrl,
          this.getGraphglQueryForList(),
          {
            namespace: this.currentEnvironmentId
          },
          this.graphQLClientService
        );
      });
  }

  public ngOnDestroy() {
    this.currentEnvironmentSubscription.unsubscribe();
  }

  protected getGraphglQueryForList() {
    return null; // override this
  }

  editEntryEventCallback(entry) {
    const query = this.getResourceJSONQuery();
    this.graphQLClientService
      .request(AppConfig.graphqlApiUrl, query, {
        name: entry.name,
        namespace: this.currentEnvironmentId
      })
      .subscribe(data => {
        this.mutateResourceModal.resourceData = data.replicaSet.json;
        this.mutateResourceModal.show();
      });
  }

  getResourceJSONQuery() {
    return `query ${this.resourceKind}($name: String! $namespace: String!) {
      replicaSet(name: $name, namespace: $namespace) {
        json
      }
    }`;
  }

  sendDeleteRequest(entry) {
    const name = entry.name;
    const namespace = this.currentEnvironmentId;
    const mutation = this.getDeleteMutation();

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      mutation,
      { name, namespace }
    );
  }

  getDeleteMutation() {
    return `mutation delete${
      this.resourceKind
    }($name: String!, $namespace: String!) {
      delete${this.resourceKind}(name: $name, namespace: $namespace) {
        name
      }
    }`;
  }
}
