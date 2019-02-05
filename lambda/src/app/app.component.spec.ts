import {
  TestBed,
  async,
  ComponentFixture,
  inject,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LambdasComponent } from './lambdas/list/lambdas.component';
import { LambdaDetailsComponent } from './lambdas/lambda-details/lambda-details.component';
import { Router } from '@angular/router';
import { ListModule } from 'app/generic-list';
import { FormsModule } from '@angular/forms';
import { AceEditorModule } from 'ng2-ace-editor';
import { ClickOutsideModule } from 'ng-click-outside';
import { EventTriggerChooserComponent } from './lambdas/lambda-details/event-trigger-chooser/event-trigger-chooser.component';
import { TimeAgoPipe } from 'time-ago-pipe';
import { LambdaEnvComponent } from './lambdas/lambda-details/lambda-env/lambda-env.component';
import { FetchTokenModalComponent } from './fetch-token-modal/fetch-token-modal.component';
import { LambdaInstanceBindingsComponent } from './lambdas/lambda-details/lambda-instance-bindings/lambda-instance-bindings.component';
import { LambdaInstanceBindingCreatorComponent } from './lambdas/lambda-details/lambda-instance-bindings/lambda-instance-binding-creator/lambda-instance-binding-creator.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: '/lambdas', pathMatch: 'full' },
          { path: 'lambdas', component: LambdasComponent },
        ]),
        ListModule,
        FormsModule,
        AceEditorModule,
        ClickOutsideModule,
      ],
      declarations: [AppComponent, TimeAgoPipe, LambdasComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
