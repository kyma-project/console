import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import { AppConfig } from '../app.config';
import { EventActivation } from '../shared/datamodel/k8s/event-activation';
import { Observable } from 'rxjs/Observable';
import { Event } from '../shared/datamodel/event';
import { Source } from '../shared/datamodel/source';
import { EventActivationResponse } from '../shared/datamodel/k8s/event-activation-response';

@Injectable()
export class EventActivationsService {
  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphqlClientService,
  ) {}

  getEventActivations(
    environment: string,
    token: string,
  ): Observable<EventActivationResponse> {
    const query = `query EventActivations($environment: String!) {
      eventActivations(environment: $environment) {
        name
        displayName
        sourceId
        events {
          eventType
          version
          description
        }
      }
    }`;
    const variables = { environment };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables,
      token,
    );
  }
}
