import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class GraphQLClientService {
  constructor(
    private apollo: Apollo
  ) {}

  gqlQuery (query, variables = {}): Observable<any> {
    return this.apollo
    .query({query: gql`${query}`, variables, fetchPolicy: 'no-cache'})
    .pipe(
      map(res => this.processResponse(res)),
      catchError(err => this.processError(err))
    );
  }

  gqlMutation (query, variables = {}): Observable<any> {
    return this.apollo
    .mutate({mutation: gql`${query}`, variables})
    .pipe(
      map(res => this.processResponse(res)),
      catchError(err => this.processError(err))
    );
  }

  gqlWatchQuery (query, variables = {}, cache?): QueryRef<any> {
    return this.apollo
    .watchQuery({query: gql`${query}`, variables, fetchPolicy: cache ? 'cache-first' : 'network-only'});
  }

  processResponse(res) {
    const response: any = res;
    const filteredErrors =
      (response &&
        response.errors &&
        response.errors.filter(
          (e: any) => !e.message.startsWith('MODULE_DISABLED')
        )) || [];
    if (filteredErrors.length) {
      return throwError(filteredErrors[0].message);
    } else if (response && response.data) {
      return response.data;
    }
  }

  processError(err) {
    let error;
    if (err.error && err.error.errors) {
      error = err.error.errors[0].message;
    } else if (err.error && err.error.message) {
      error = err.error.message;
    }
    error = error || err.message || err;
    return throwError(error);
  }
}
