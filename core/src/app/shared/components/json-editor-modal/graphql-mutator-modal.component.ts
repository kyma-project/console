import { GraphQLClientService } from './../../services/graphql-client-service';
import { Component, Input, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { JsonEditorModalComponent } from './json-editor-modal.component';
import { AppConfig } from 'app/app.config';
import { K8sResourceEditorService } from './services/k8s-resource-editor.service';

@Component({
  selector: 'app-graphql-mutator-modal',
  templateUrl: './json-editor-modal.component.html',
  styleUrls: ['./json-editor-modal.component.scss']
})
export class GraphqlMutatorModalComponent extends JsonEditorModalComponent {
  constructor(
    communicationService: ComponentCommunicationService,
    private graphQLClientService: GraphQLClientService,
    k8sResourceEditorService: K8sResourceEditorService
  ) {
    super(communicationService, k8sResourceEditorService);
  }

  sendUpdateRequest() {
    const resourceValue = this.jsonEditor.getCurrentValue();
    const name = resourceValue.metadata.name;
    const namespace = resourceValue.metadata.namespace;
    const resourceKindCamelCase = this.lowerFirstLetter(resourceValue.kind);
    const parameters = {
      name,
      namespace
    };
    parameters[resourceKindCamelCase] = resourceValue;

    const mutation = `mutation update${
      resourceValue.kind
    }($name: String!, $namespace: String!, $${resourceKindCamelCase}: JSON!) {
      update${
        resourceValue.kind
      }(name: $name, namespace: $namespace, ${resourceKindCamelCase}: $${resourceKindCamelCase}) {
        name
      }
    }`;

    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      mutation,
      parameters
    );
  }

  displayErrorMessage(message) {
    this.error = {
      message
    };
  }

  lowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }
}
