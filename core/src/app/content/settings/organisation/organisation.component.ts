import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../../app.config';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-organisation',
  templateUrl: './organisation.component.html',
  styleUrls: ['./organisation.component.scss']
})
export class OrganisationComponent implements OnInit {
  public orgId: string;
  public orgName: string;

  constructor(private http: HttpClient) {}

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
  }
}
