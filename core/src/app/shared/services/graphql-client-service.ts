import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class GraphQLClientService {
  constructor(private http: HttpClient) {}

  request(url, query, variables) {
    return this.http.post<any[]>(url, { query, variables }).pipe(
      map(res => {
        const response: any = res;

        if (response && response.errors) {
          throw new Error(response.errors[0].message);
        }
        if (response && response.data) {
          return response.data;
        }
      })
    );
  }
}
