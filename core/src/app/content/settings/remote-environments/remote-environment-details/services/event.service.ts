import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';

@Injectable()
export class EventService {
  fallback: object[] = [
    {
      id: 1,
      name: 'cart-saved',
      source: 'ec-prod',
      description: 'This event gets fired whenever an cart gets saved.',
      payload: 'oder id'
    },
    {
      id: 2,
      name: 'order-created',
      source: 'ec-prod',
      description: 'This event gets fired whenever an new order gets created.',
      payload: 'order id'
    },
    {
      id: 3,
      name: 'order-updated',
      source: 'ec-prod',
      description: 'This event gets fired whenever an order gets modified.',
      payload: 'order id'
    },
    {
      id: 4,
      name: 'order-deleted',
      source: 'ec-prod',
      description: 'This event gets fired whenever an order gets deleted.',
      payload: ''
    }
  ];

  constructor(private http: HttpClient, private oAuthService: OAuthService) {}

  getRemoteEvents(envId?: string): Observable<any[]> {
    return of(this.fallback);
  }
}
