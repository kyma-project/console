import { Component } from '@angular/core';
import { EnvironmentsService } from '../services/environments.service';
import LuigiClient from '@kyma-project/luigi-client';

@Component({
  selector: 'app-environment-create',
  templateUrl: './environment-create.component.html',
  styleUrls: ['./environment-create.component.css']
})
export class EnvironmentCreateComponent {
  public environments = [];
  public environmentName: string;
  public isActive: boolean;
  private err: string;
  private wrongName = false;

  constructor(private environmentsService: EnvironmentsService) {}

  public createEnvironment() {
    this.environmentsService.createEnvironment(this.environmentName).subscribe(
      () => {
        this.isActive = false;
        this.navigateToDetails(this.environmentName);
      },
      err => {
        this.err = err.error.message;
      }
    );
  }

  private validateRegex() {
    const regex = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
    this.environmentName
      ? (this.wrongName = !regex.test(this.environmentName))
      : (this.wrongName = false);
  }

  public cancel() {
    this.isActive = false;
    this.wrongName = false;
  }

  public show() {
    this.environmentName = '';
    this.err = undefined;
    this.isActive = true;
  }

  public navigateToDetails(envName) {
    LuigiClient.linkManager().navigate(`/home/environments/${envName}/details`);
  }
}
