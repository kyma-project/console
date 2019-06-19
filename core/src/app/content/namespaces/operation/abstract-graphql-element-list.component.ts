import {
  Component,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { AbstractKubernetesElementListComponent } from './abstract-kubernetes-element-list.component';
import { GraphqlMutatorModalComponent } from 'shared/components/json-editor-modal/graphql-mutator-modal.component';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { ComponentCommunicationService } from 'shared/services/component-communication.service';
import { Filter, DataProviderResult } from 'app/generic-list';
import { Subscription } from 'rxjs';
import { GraphQLDataProvider } from './graphql-data-provider';
import { GraphQLClientService } from 'shared/services/graphql-client-service';
import { Observable } from 'apollo-link';

@Component({
  selector: 'abstract-graphql-element-list',
  templateUrl: './kubernetes-element-list.component.html'
})
export class AbstractGraphqlElementListComponent
  extends AbstractKubernetesElementListComponent
  implements OnDestroy, OnInit {
  public currentNamespaceId: string;
  private currentNamespaceSubscription: Subscription;
  public hideFilter = false;
  protected deleteMutationName?: string = null; // "special" resource kind for delete mutations - needs to be capitalized in most of the cases. If not provided, resourceKind will be used instead
  protected gqlVariables$?: Observable<{ [key: string]: any }> = null;

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
  }

  public ngOnDestroy() {
    if (this.currentNamespaceSubscription) {
      this.currentNamespaceSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }
  public ngOnInit() {
    super.ngOnInit();
    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
        if (this.gqlVariables$) {
          this.initGraphQLWithVariables();
          return;
        }
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

  protected getGraphqlQueryForList() {
    return null; // override this
  }

  protected getGraphqlSubscriptionsForList() {
    return null; // override this
  }

  editEntryEventCallback(entry) {
    const query = this.getResourceJSONQuery();
    const variables = {
      name: entry.name,
      namespace: this.currentNamespaceId
    };
    this.graphQLClientService.gqlQuery(query, variables).subscribe(data => {
      const lowerCaseResourceKind =
        this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
      this.mutateResourceModal.resourceData = data[lowerCaseResourceKind].json;
      this.mutateResourceModal.show();
    });
  }

  getResourceJSONQuery() {
    const lowerCaseResourceKind =
      this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
    const variablesDefinitionsString = this.currentNamespaceId
      ? `$name: String!, $namespace: String!`
      : `$name: String!`;
    const variablesString = this.currentNamespaceId
      ? `name: $name, namespace: $namespace`
      : `name: $name`;
    return `query ${lowerCaseResourceKind}(${variablesDefinitionsString}) {
      ${lowerCaseResourceKind}(${variablesString}) {
        json
      }
    }`;
  }

  sendDeleteRequest(entry) {
    const mutation = this.getDeleteMutation();
    const variables = {
      name: entry.name,
      namespace: this.currentNamespaceId
    };
    return this.graphQLClientService.gqlMutation(mutation, variables);
  }

  getDeleteMutation() {
    const variablesDefinitionsString = this.currentNamespaceId
      ? `$name: String!, $namespace: String!`
      : `$name: String!`;
    const variablesString = this.currentNamespaceId
      ? `name: $name, namespace: $namespace`
      : `name: $name`;
    return `mutation delete${this.deleteMutationName ||
      this.resourceKind}(${variablesDefinitionsString}) {
      delete${this.deleteMutationName ||
        this.resourceKind}(${variablesString}) {
        name
      }
    }`;
  }

  private initGraphQLWithVariables() {
    this.gqlVariables$.subscribe(variables => {
      this.source = new GraphQLDataProvider(
        this.getGraphqlQueryForList(),
        {
          namespace: this.currentNamespaceId,
          ...variables
        },
        this.graphQLClientService,
        this.getGraphqlSubscriptionsForList(),
        this.resourceKind
      );
      this.reload();
    });
  }
}
