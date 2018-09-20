import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GraphqlClientService {
  constructor(private http: HttpClient) {}

  request(url, query, variables, token: string): Observable<any> {
    const httpOptions = this.getHTTPOptions(token);
    return this.http.post(url, { query, variables }, httpOptions);
  }

  getHTTPOptions(token: string): object {
    let httpHeaders: any;
    httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return httpHeaders;
  }

  requestWithToken(url, query, variables, token: string) {
    const httpOptions = this.getHTTPOptions(token);

    const result = this.http
      .post(url, { query, variables }, httpOptions)
      .map(res => {
        const response: any = res;

        if (response && response.errors) {
          throw new Error(response.errors[0].message);
        }
        if (response && response.data) {
          return response.data;
        }
      });
    return result;
  }
}
