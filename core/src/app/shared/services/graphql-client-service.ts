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
          switch (err) {
            case err.error && err.error.errors:
              error = err.error.errors[0].message;
              break;
            case err.error && err.error.message:
              error = err.error.message;
              break;
            default:
              error = err.message;
              break;
          }
          observer.error(error);
        }
      );
    });
  }
}
