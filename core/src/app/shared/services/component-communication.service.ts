import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ComponentCommunicationService {
  private subject = new Subject();
  observable$ = this.subject.asObservable();

  constructor() {}

  sendEvent(event: any) {
    this.subject.next(event);
  }
}
