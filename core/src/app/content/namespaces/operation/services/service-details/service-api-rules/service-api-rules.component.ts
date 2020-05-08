import { Component, OnInit, Input, ViewChild } from '@angular/core';
import LuigiClient from '@luigi-project/client';

import { InformationModalComponent } from 'shared/components/information-modal/information-modal.component';
import { ConfirmationModalComponent } from 'shared/components/confirmation-modal/confirmation-modal.component';
import { CurrentNamespaceService } from 'namespaces/services/current-namespace.service';
import { GraphQLClientService } from 'shared/services/graphql-client-service';

import { GET_API_RULES, DELETE_API_RULE } from './gql';

@Component({
  selector: 'app-service-api-rules',
  templateUrl: './service-api-rules.component.html',
})
export class ServiceApiRulesComponent implements OnInit {
  @Input() serviceName: string;

  apiRules = [];
  error = null;
  actions = [
    { function: 'delete', name: 'Delete' },
    { function: 'edit', name: 'Edit'}
  ];
  entryEventHandler = this.getEntryEventHandler();

  private currentNamespace: string;

  @ViewChild('confirmationModal')
  private confirmationModal: ConfirmationModalComponent;
  @ViewChild('infoModal')
  private infoModal: InformationModalComponent;

  constructor(private gqlClientService: GraphQLClientService,
    private currentNamespaceService: CurrentNamespaceService) { }

  ngOnInit(): void {
    this.currentNamespaceService.getCurrentNamespaceId().subscribe(namespace => {
      this.currentNamespace = namespace;
      this.getApiRules();
    })
  }

  navigateToDetails(apiRuleName: string) {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-apirules/details/${apiRuleName}`);
  }

  private getEntryEventHandler(): any {
    return {
      delete: (entry: any) =>
        this.confirmationModal
          .show('Confirm delete', `Do you really want to delete ${entry.name}?`)
          .then(() => this.deleteApiRule(entry), () => {}),
      navigateToEdit: (entry: any) =>
        LuigiClient.linkManager()
          .fromContext('namespaces')
          .navigate(`cmf-apirules/edit/${entry.name}`)
    };
  }

  private getApiRules() {
    this.gqlClientService.gqlQuery(GET_API_RULES, { namespace: this.currentNamespace, serviceName: this.serviceName })
      .subscribe(data => this.apiRules = data.APIRules,
      error => {
        this.error = error.message || error;
        console.warn(error);
      });
  }

  private deleteApiRule(entry: any) {
    this.gqlClientService.gqlMutation(DELETE_API_RULE, { name: entry.name, namespace: this.currentNamespace })
      .subscribe(() => this.apiRules = this.apiRules.filter(rule => rule.name !== entry.name),
      error =>
        this.infoModal.show(
          'Error',
          `There was an error while trying to delete ${entry.name}: ${error.message || error}`)
    );
  }
}
