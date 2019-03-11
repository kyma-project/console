import { GraphQLClientService } from './../../services/graphql-client-service';
import { Component } from '@angular/core';
import { ModalService } from 'fundamental-ngx';
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
    protected modalService: ModalService,
    k8sResourceEditorService: K8sResourceEditorService
  ) {
    super(communicationService, modalService, k8sResourceEditorService);
  }

  sendUpdateRequest() {
    const newResourceValue = this.jsonEditor.getCurrentValue();
    const name = this.resourceData.metadata.name;
    const namespace = this.resourceData.metadata.namespace;
    const resourceKindCamelCase = this.lowerFirstLetter(this.resourceData.kind);
    const parameters = {
      name,
      namespace
    };
    parameters[resourceKindCamelCase] = newResourceValue;

    const mutation = `mutation update${
      this.resourceData.kind
    }($name: String!, $namespace: String!, $${resourceKindCamelCase}: JSON!) {
      update${
        this.resourceData.kind
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
