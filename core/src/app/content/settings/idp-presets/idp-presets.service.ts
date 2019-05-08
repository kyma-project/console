import { AppConfig } from './../../../app.config';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GraphQLClientService } from '../../../shared/services/graphql-client-service';

@Injectable()
export class IdpPresetsService {
  public idpChangeStateEmitter$: EventEmitter<boolean>;

  constructor(
    private httpClient: HttpClient,
    private graphQLClientService: GraphQLClientService
  ) {
    this.idpChangeStateEmitter$ = new EventEmitter();
  }

  public createIdpPreset(data) {
    const mutation = `mutation createIDPPreset($name: String!, $issuer: String!, $jwksUri: String!) {
      createIDPPreset(name: $name, issuer: $issuer, jwksUri: $jwksUri){
        name
      }
    }`;
    const variables = {
      name: data.name,
      issuer: data.issuer,
      jwksUri: data.jwksUri
    };

    return this.graphQLClientService.gqlMutation(
      mutation,
      variables
    );
  }

  public deleteIdpPreset(name) {
    const mutation = `mutation deleteIDPPreset($name: String!) {
      deleteIDPPreset(name: $name){
        name
      }
    }`;
    const variables = {
      name
    };

    return this.graphQLClientService.gqlMutation(
      mutation,
      variables
    );
  }

  public getDefaultIdpPreset = () => {
    return this.httpClient.get<any>(
      `${AppConfig.authIssuer}/.well-known/openid-configuration`,
      {}
    );
  };

  public getIDPPresets() {
    const query = `query {
      IDPPresets{
        name
        issuer
        jwksUri
      }
    }`;

    return this.graphQLClientService.gqlQuery(
      query,
      {}
    );
  }
}
