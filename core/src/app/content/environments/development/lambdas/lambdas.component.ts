import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../../../app.config';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-development',
  templateUrl: './lambdas.component.html',
  styleUrls: ['./lambdas.component.scss']
})
export class LambdasComponent implements OnInit {
  public externalUrl: string = AppConfig.lambdasModuleUrl;
  public path = '/home/environments/';
  public executionAsync = false;

  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['name']) {
        this.externalUrl = `${AppConfig.lambdasModuleUrl}/lambdas/${
          params['name']
        }`;
      } else {
        this.route.url.subscribe(url => {
          if (url[1] && url[1].path === 'create') {
            this.externalUrl = `${AppConfig.lambdasModuleUrl}/create`;
          }
        });
      }
    });
  }
}
