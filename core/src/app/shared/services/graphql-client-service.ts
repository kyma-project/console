import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
export class GraphQLClientService {
  constructor(
    private apollo: Apollo
  ) {}

  gqlQuery (query, variables = {}) {
    return this.apollo
    .watchQuery({query: gql`${query}`, variables}).valueChanges
    .pipe(map(res => res.data));
  }

  gqlMutation (query, variables = {}) {
    return this.apollo
    .mutate({mutation: gql`${query}`, variables})
    .pipe(map(res => res.data));
  }
}
