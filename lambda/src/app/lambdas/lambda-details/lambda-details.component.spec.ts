import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LambdaDetailsComponent } from './lambda-details.component';
import { FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApisService } from '../../apis/apis.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventActivationsService } from '../../event-activations/event-activations.service';
import { GraphqlClientService } from '../../graphql-client/graphql-client.service';
import { LambdaDetailsService } from './lambda-details.service';
import { ServiceBindingsService } from '../../service-bindings/service-bindings.service';
import { ServiceBindingUsagesService } from '../../service-binding-usages/service-binding-usages.service';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LambdasComponent } from '../list/lambdas.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { TriggersService } from '../../triggers/triggers.service';

describe('LambdaDetailsComponent', () => {
  let component: LambdaDetailsComponent;
  let fixture: ComponentFixture<LambdaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ClickOutsideModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: '/lambdas', pathMatch: 'full' }
        ]),
        AceEditorModule
      ],
      declarations: [LambdaDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ApisService,
        EventActivationsService,
        GraphqlClientService,
        LambdaDetailsService,
        ServiceBindingsService,
        ServiceBindingUsagesService,
        SubscriptionsService,
        TriggersService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LambdaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
