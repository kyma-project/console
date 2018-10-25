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
  ): Promise<boolean> {
    const result = new Promise<boolean>(resolve => {
      if (this.pageDirtyService.isPageDirty()) {
        const confirmationText =
          'You have unsaved changes. If you proceed, these changes will be lost. Proceed?';
        if (component && component.confirmationModal) {
          component.confirmationModal
            .show('Unsaved Changes', confirmationText)
            .then(
              () => {
                this.pageDirtyService.setPageDirty(false);
                resolve(true);
              },
              () => {
                resolve(false);
              }
            );
        } else {
          const decision = window.confirm(confirmationText);
          if (decision) {
            this.pageDirtyService.setPageDirty(false);
          }
          resolve(decision);
        }
      } else {
        resolve(true);
      }
    });
    return result;
  }
}
