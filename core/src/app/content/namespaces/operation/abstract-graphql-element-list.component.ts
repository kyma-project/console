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
import { AppConfig } from 'app/app.config';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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
    private apollo: Apollo,
    changeDetector: ChangeDetectorRef
  ) {
    super(currentNamespaceService, changeDetector, null, commService);

    this.currentNamespaceSubscription = this.currentNamespaceService
      .getCurrentNamespaceId()
      .subscribe(namespaceId => {
        this.currentNamespaceId = namespaceId;
        this.source = new GraphQLDataProvider(
          AppConfig.graphqlApiUrl,
          this.getGraphqlQueryForList(),
          {
            namespace: this.currentNamespaceId
          },
          this.apollo,
          this.getGraphqlSubscriptionsForList()
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
    this.apollo
      .query({query: gql`${query}`, variables: {
        name: entry.name,
        namespace: this.currentNamespaceId
      }})
      .subscribe(res => {
        const data = res.data;
        const lowerCaseResourceKind = this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
        this.mutateResourceModal.resourceData = data[lowerCaseResourceKind].json;
        this.mutateResourceModal.show();
      });
  }

  getResourceJSONQuery() {
    const lowerCaseResourceKind = this.resourceKind.charAt(0).toLowerCase() + this.resourceKind.slice(1);
    return `query ${lowerCaseResourceKind}($name: String! $namespace: String!) {
      ${lowerCaseResourceKind}(name: $name, namespace: $namespace) {
        json
      }
    }`;
  }

  sendDeleteRequest(entry) {
    const name = entry.name;
    const namespace = this.currentNamespaceId;
    const mutation = this.getDeleteMutation();

    return this.apollo.mutate(
      {
        mutation: gql`${mutation}`,
        variables: { name, namespace }
      }
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
