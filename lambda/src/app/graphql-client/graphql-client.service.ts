import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

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
        Authorization: `${token}`,
      }),
    };
    return httpHeaders;
  }

  requestWithToken(url, query, variables, token: string) {
    const httpOptions = this.getHTTPOptions(token);

    console.log('HERE');
    const result = this.http
      .post(url, { query, variables }, httpOptions)
      .map(res => {
        const response: any = res;

        if (response && response.errors) {
          console.log('response', response.errors[0]);
          throw new Error(response.errors[0].message);
        }
        if (response && response.data) {
          console.log('response.data', response.data);
          return response.data;
        }
      });
    return result;
  }
}
