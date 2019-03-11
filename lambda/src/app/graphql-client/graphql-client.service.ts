import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

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
        const filteredErrors =
          (response &&
            response.errors &&
            response.errors.filter(
              (e: any) => !e.message.startsWith('MODULE_DISABLED'),
            )) ||
          [];
        if (filteredErrors.length) {
          throw new Error(filteredErrors[0].message);
        }
        if (response && response.data) {
          return response.data;
        }
      });
    return result;
  }
}
