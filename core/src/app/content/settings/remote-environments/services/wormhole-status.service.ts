import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class WormholeStatusService {
  constructor() {}

  getConnectionLatency(name: string): Observable<number> {
    return of(Math.floor(Math.random() * 101) + 100).pipe(delay(300));
  }
}
