import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LambdasComponent } from './lambdas.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeploymentDetailsService } from './deployment-details.service';
import { ApisService } from '../../apis/apis.service';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { ServiceBindingUsagesService } from '../../service-binding-usages/service-binding-usages.service';
import { TriggersService } from './../../triggers/triggers.service';

describe('LambdasComponent', () => {
  let component: LambdasComponent;
  let fixture: ComponentFixture<LambdasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [LambdasComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        DeploymentDetailsService,
        ApisService,
        SubscriptionsService,
        ServiceBindingUsagesService,
        TriggersService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LambdasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
