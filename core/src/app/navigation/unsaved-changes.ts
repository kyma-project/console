import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class UnsavedChanges implements CanDeactivate<any> {
  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;

    if (sessionStorage.getItem('unsavedChanges') !== '') {
      return window.confirm(sessionStorage.getItem('unsavedChanges'));
    }

    return true;
  }
}
