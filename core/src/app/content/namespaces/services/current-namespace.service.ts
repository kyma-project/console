import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class CurrentNamespaceService implements OnDestroy {
  private currentNamespaceId = new ReplaySubject<string>(1);

  public getCurrentNamespaceId(): ReplaySubject<string> {
    return this.currentNamespaceId;
  }

  public setCurrentNamespaceId(newNamespaceId) {
    this.currentNamespaceId.next(newNamespaceId);
  }

  ngOnDestroy() {
    this.currentNamespaceId.complete();
  }
}
