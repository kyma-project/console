import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GraphqlClientService } from '../graphql-client/graphql-client.service';
import { AppConfig } from '../app.config';
import { EventActivation } from '../shared/datamodel/k8s/event-activation';
import { Observable } from 'rxjs';
import { Event } from '../shared/datamodel/event';
import { EventActivationResponse } from '../shared/datamodel/k8s/event-activation-response';

@Injectable()
export class EventActivationsService {
  constructor(
    private http: HttpClient,
    private graphQLClientService: GraphqlClientService,
  ) {}

  getEventActivations(
    namespace: string,
    token: string,
  ): Observable<EventActivationResponse> {
    const query = `query EventActivations($namespace: String!) {
      eventActivations(namespace: $namespace) {
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
    const variables = { namespace };
    return this.graphQLClientService.request(
      AppConfig.graphqlApiUrl,
      query,
      variables,
      token,
    );
  }
}
