import { Injectable } from '@angular/core';

@Injectable()
export class ExtAppViewRegistryService {
  private registry = [];
  private sessions = {};
  private navigationConfirmations = [];

  /**
   * Registers given view as a known external app view and generates a session ID for it.
   * The generated session ID is returned.
   *
   * @param view view to register
   * @returns {string} generated session ID
   */
  registerView(view: any): string {
    const sessionId = this.generateSessionId();
    if (!this.isRegistered(view)) {
      this.registry.push(view);
    }
    this.sessions[sessionId] = view;
    return sessionId;
  }

  /**
   * Deregisters given view from tje list of known external app views.
   *
   * @param view view to deregister.
   */
  deregisterView(view: any) {
    const r = [];
    this.registry.forEach(v => {
      if (view !== v) {
        r.push(v);
      }
    });
    this.registry = r;

    const s = [];
    for (const id in this.sessions) {
      if (this.sessions[id] !== view) {
        s[id] = this.sessions[id];
      }
    }
    this.sessions = s;
  }

  isRegistered(view: any) {
    let registered = null;
    this.registry.forEach(v => {
      if (view === v) {
        registered = view;
      }
    });

    return !!registered;
  }

  isRegisteredSession(view: any, sessionId: string) {
    let registered = null;
    this.registry.forEach(v => {
      if (view === v) {
        registered = view;
      }
    });

    return this.isRegistered(view) && view === this.sessions[sessionId];
  }

  confirmNavigation(view: any) {
    if (!this.isNavigationConfirmed(view)) {
      this.navigationConfirmations.push(view);
    }
  }

  resetNavigationConfirmation(view: any) {
    const n = [];
    this.navigationConfirmations.forEach(v => {
      if (view !== v) {
        n.push(v);
      }
    });
    this.navigationConfirmations = n;
  }

  isNavigationConfirmed(view: any) {
    let confirmed = null;
    this.registry.forEach(v => {
      if (view === v) {
        confirmed = view;
      }
    });

    return !!confirmed;
  }

  private generateSessionId() {
    const generatePart = () => {
      return '' + Math.floor(Math.random() * 1000000);
    };
    return generatePart() + '-' + generatePart() + '-' + generatePart();
  }
}
