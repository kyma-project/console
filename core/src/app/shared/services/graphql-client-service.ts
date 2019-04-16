import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable()
export class GraphQLClientService {
  constructor(
    private apollo: Apollo
  ) {}

  gqlQuery (query, variables = {}): Observable<any> {
    return this.apollo
    .query({query: gql`${query}`, variables, fetchPolicy: 'network-only'})
    .pipe(map(res => res.data));
  }

  gqlMutation (query, variables = {}): Observable<any> {
    return this.apollo
    .mutate({mutation: gql`${query}`, variables})
    .pipe(map(res => res.data));
  }
}
