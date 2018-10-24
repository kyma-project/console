import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

@Injectable()
export class GraphQLClientService {
  constructor(private http: HttpClient) {}

  request(url, query, variables): Observable<any> {
    return this.http.post(url, { query, variables }).pipe(
      concatMap(res => {
        const response: any = res;
        if (response && response.errors) {
          return throwError(response.errors[0].message);
        } else if (response && response.data) {
          return of(response.data);
        }
      }),
      catchError(err => {
        let error;
        if (err.error && err.error.errors) {
          error = err.error.errors[0].message;
        } else if (err.error && err.error.message) {
          error = err.error.message;
        }
        error = error || err.message || err;
        return throwError(error);
      })
    );
  }
}
