import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PlainLogQuery } from '../data/plain-log-query';
import { Observable } from 'rxjs';
import { AppConfig } from '../../app.config';
import { LuigiContextService } from './luigi-context.service';

@Injectable()
export class SearchService {
  constructor(
    private http: HttpClient,
    private luigiContextService: LuigiContextService,
  ) {}

  search(query: PlainLogQuery): Observable<any> {
    let reqParams = new HttpParams()
      .set('query', query.query)
      .set('start', query.from + '000000')
      .set('end', query.to + '000000')
      .set('direction', query.direction)
      .set('limit', String(query.limit));

    if (query.regexp.trim() !== '') {
      reqParams = reqParams.set('regexp', query.regexp);
    }
    const httpHeaders = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.extractToken(),
    );
    return this.http.get(AppConfig.queryEndpoint, {
      headers: httpHeaders,
      params: reqParams,
      responseType: 'text',
    });
  }

  getLabelValues(label: string) {
    const httpHeaders = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.extractToken(),
    );
    return this.http.get(AppConfig.labelEndpoint + '/' + label + '/values', {
      headers: httpHeaders,
      responseType: 'text',
    });
  }

  getLabels(): Observable<any> {
    const httpHeaders = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.extractToken(),
    );
    return this.http.get(AppConfig.labelEndpoint, {
      headers: httpHeaders,
      responseType: 'text',
    });
  }

  extractToken(): string {
    let idToken = '';
    this.luigiContextService.getContext().subscribe(data => {
      idToken = data.context.idToken;
    });

    return idToken;
  }
}
