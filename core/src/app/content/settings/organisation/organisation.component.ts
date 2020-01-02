import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { SHOW_SYSTEM_NAMESPACES_CHANGED_EVENT } from './../../../shared/constants/constants';
import LuigiClient from '@kyma-project/luigi-client';

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
    this.orgId = AppConfig.orgId;
    this.orgName = AppConfig.orgName;

    if (localStorage.getItem('console.showSystemNamespaces')) {
      this.showSystemNamespaces =
        localStorage.getItem('console.showSystemNamespaces') === 'true';
    }
  }

  public toggleSystemNamespaceVisibility() {
    localStorage.setItem(
      'console.showSystemNamespaces',
      this.showSystemNamespaces.toString()
    );
    this.refreshContextSwitcher();

    window.parent.postMessage(
      {
        msg: SHOW_SYSTEM_NAMESPACES_CHANGED_EVENT,
        showSystemNamespaces: this.showSystemNamespaces
      },
      '*'
    );
  }

  public toggleExperimentalViews() {
    localStorage.setItem(
      'console.showExperimentalViews',
      this.showExperimentalViews.toString()
    );
    LuigiClient.sendCustomMessage({ id: 'console.toggleExperimental' });
  }

  private refreshContextSwitcher() {
    window.parent.postMessage({ msg: 'luigi.refresh-context-switcher' }, '*');
  }
}
