import {
  Component,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { AbstractKubernetesElementListComponent } from './abstract-kubernetes-element-list.component';
import { GraphqlMutatorModalComponent } from 'shared/components/json-editor-modal/graphql-mutator-modal.component';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { Filter } from 'app/generic-list';
import { Subscription } from 'rxjs';
import { GraphQLDataProvider } from './graphql-data-provider';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

@Component({
  selector: 'abstract-graphql-element-list',
  templateUrl: './kubernetes-element-list.component.html'
})
export class AbstractGraphqlElementListComponent
  extends AbstractKubernetesElementListComponent
  implements OnDestroy {
  public currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;

  @ViewChild('mutateResourceModal')
  mutateResourceModal: GraphqlMutatorModalComponent;

  filterState = {
    filters: [new Filter('name', '', false)]
  };

  constructor(
    private currentNamespaceService: CurrentNamespaceService,
    private commService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, null, commService);
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
        this.source = new GraphQLDataProvider(
          this.getGraphqlQueryForList(),
          {
            namespace: this.currentNamespaceId
          },
          this.graphQLClientService,
          this.getGraphqlSubscriptionsForList(),
          this.resourceKind
        );
      });
  }

  public ngOnDestroy() {
    this.currentNamespaceSubscription.unsubscribe();
  }

  protected getGraphqlQueryForList() {
    return null; // override this
  }

  protected getGraphqlSubscriptionsForList() {
    return null; // override this
  }

  editEntryEventCallback(entry) {
    const query = this.getResourceJSONQuery();
    this.graphQLClientService
      .gqlQuery(query, {
        name: entry.name,
        namespace: this.currentNamespaceId
      })
      .subscribe(data => {
        const lowerCaseResourceKind = this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
        this.mutateResourceModal.resourceData = data[lowerCaseResourceKind].json;
        this.mutateResourceModal.show();
      });
  }

  getResourceJSONQuery() {
    const lowerCaseResourceKind = this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
    let var1 = `$name: String!`;
    let var2 = `name: $name`;
    if (this.currentNamespaceId) {
      var1 = `$name: String!, $namespace: String!`;
      var2 = `name: $name, namespace: $namespace`;
    }
    return `query ${lowerCaseResourceKind}(${var1}) {
      ${lowerCaseResourceKind}(${var2}) {
        json
      }
    }`;
  }

  sendDeleteRequest(entry) {
    const name = entry.name;
    const namespace = this.currentNamespaceId;
    const mutation = this.getDeleteMutation();

    return this.graphQLClientService.gqlMutation(mutation, { name, namespace });
  }

  getDeleteMutation() {
    let var1 = `$name: String!`;
    let var2 = `name: $name`;
    if (this.currentNamespaceId) {
      var1 = `$name: String!, $namespace: String!`;
      var2 = `name: $name, namespace: $namespace`;
    }
    return `mutation delete${this.resourceKind}(${var1}) {
      delete${this.resourceKind}(${var2}) {
        name
      }
    }`;
  }
}
