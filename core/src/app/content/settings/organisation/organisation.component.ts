import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { SHOW_SYSTEM_NAMESPACES_CHANGED_EVENT } from './../../../shared/constants/constants';
import LuigiClient from '@luigi-project/client';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit {
  public orgId: string;
  public orgName: string;
  public showSystemNamespaces = false;
  public showExperimentalViews = false;
  public showDeprecatedViews = false;
  public shouldShowNamespacesToggle = true;

  constructor(private http: HttpClient) {
    this.showExperimentalViews =
      localStorage.getItem('console.showExperimentalViews') === 'true';
    this.showDeprecatedViews =
      localStorage.getItem('console.showDeprecatedViews') === 'true';
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
    this.orgId = AppConfig.orgId;
    this.orgName = AppConfig.orgName;

    const groups = LuigiClient.getNodeParams().groups;
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


  public toggleDeprecatedViews() {
    this.toggleViewVisibilityPreference('showDeprecatedViews');
  }

  public toggleExperimentalViews() {
    this.toggleViewVisibilityPreference('showExperimentalViews');
  }

  private toggleViewVisibilityPreference(key: string) {
    localStorage.setItem(`console.${key}`, this[key]);
  }
}
