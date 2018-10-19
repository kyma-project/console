import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { PageDirtyStateService } from '../shared/services/page-dirty-state.service';

@Injectable()
export class UnsavedChanges implements CanDeactivate<any> {

  constructor(private pageDirtyService: PageDirtyStateService) {}

  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (this.pageDirtyService.isPageDirty()) {
      const decision = window.confirm('You have unsaved changes. If you proceed, these changes will be lost. Proceed?');
      if (decision) {
        this.pageDirtyService.setPageDirty(false);
      }
      return decision;
    }

    return true;
  }
}
