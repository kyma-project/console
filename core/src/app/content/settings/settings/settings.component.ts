import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { SHOW_SYSTEM_NAMESPACES_CHANGED_EVENT } from '../../../shared/constants/constants';
import LuigiClient from '@luigi-project/client';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  public showSystemNamespaces = false;
  public showExperimentalViews = false;
  public shouldShowNamespacesToggle = true;

  constructor(private http: HttpClient) {
    this.showExperimentalViews =
      localStorage.getItem('console.showExperimentalViews') === 'true';
  }

  public downloadKubeconfig() {
    return this.http
      .get(AppConfig.kubeconfigGeneratorUrl, {
        responseType: 'blob'
      })
      .subscribe(res => {
        FileSaver.saveAs(res, 'kubeconfig');
      });
  }

  ngOnInit() {
    const groups = LuigiClient.getContext().groups;
    this.shouldShowNamespacesToggle = this.isVisibleForCurrentGroup(groups);

    if (localStorage.getItem('console.showSystemNamespaces')) {
      this.showSystemNamespaces =
        localStorage.getItem('console.showSystemNamespaces') === 'true';
    }
  }

  public isVisibleForCurrentGroup(groups) {
    if (!Array.isArray(groups)) { return true };
    return groups.includes(AppConfig.runtimeAdminGroupName);
  }

  public toggleSystemNamespaceVisibility() {
    localStorage.setItem(
      'console.showSystemNamespaces',
      this.showSystemNamespaces.toString()
    );

    window.parent.postMessage(
      {
        msg: SHOW_SYSTEM_NAMESPACES_CHANGED_EVENT,
        showSystemNamespaces: this.showSystemNamespaces
      },
      '*'
    );
  }

  public toggleExperimentalViews() {
    this.toggleViewVisibilityPreference('showExperimentalViews');
  }

  private toggleViewVisibilityPreference(key: string) {
    localStorage.setItem(`console.${key}`, this[key]);
  }
}
