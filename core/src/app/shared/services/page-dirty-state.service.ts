import { Injectable } from '@angular/core';

@Injectable()
export class PageDirtyStateService {
  private pageDirty = false;

  constructor() {}

  setPageDirty(dirty: boolean) {
    this.pageDirty = dirty
  }

  isPageDirty(): boolean {
    return this.pageDirty;
  }
}
