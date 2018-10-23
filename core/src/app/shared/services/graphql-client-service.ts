import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class GraphQLClientService {
  constructor(private http: HttpClient) {}

  request(url, query, variables): Observable<any> {
    return Observable.create(observer => {
      this.http.post(url, { query, variables }).subscribe(
        res => {
          const response: any = res;
          if (response && response.errors) {
            observer.error(response.errors[0].message);
          }
          if (response && response.data) {
            observer.next(response.data);
          }
        },
        err => {
          let error;

          if (err.error) {
            if (err.error.errors) {
              error = err.error.errors[0].message;
            } else if (err.error.message) {
              error = err.error.message;
            } else {
              error = err.message || err;
            }
          } else {
            error = err.message || err;
          }

          observer.error(error);
        }
      );
    });
  }
}
