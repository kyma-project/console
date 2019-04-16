import { Injectable } from '@angular/core';
import { map, concatMap, catchError } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, throwError, of } from 'rxjs';

@Injectable()
export class GraphQLClientService {
  constructor(
    private apollo: Apollo
  ) {}

  gqlQuery (query, variables = {}): Observable<any> {
    return this.apollo
    .query({query: gql`${query}`, variables, fetchPolicy: 'network-only'})
    .pipe(
      concatMap(res => {
        return this.processResponse(res);
      }),
      catchError(err => {
        return this.processError(err);
      })
    );
  }

  gqlMutation (query, variables = {}): Observable<any> {
    return this.apollo
    .mutate({mutation: gql`${query}`, variables})
    .pipe(
      concatMap(res => {
        return this.processResponse(res);
      }),
      catchError(err => {
        return this.processError(err);
      })
    );
  }

  processResponse(res) {
    const response: any = res;
    const filteredErrors =
      (response &&
        response.errors &&
        response.errors.filter(
          (e: any) => !e.message.startsWith('MODULE_DISABLED')
        )) ||
      [];
    if (filteredErrors.length) {
      return throwError(filteredErrors[0].message);
    } else if (response && response.data) {
      return of(response.data);
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
