import { ListModule } from 'app/generic-list';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeploymentsComponent } from './deployments.component';
import { AppModule } from '../../../../app.module';
import * as LuigiClient from '@kyma-project/luigi-client';
import { APP_BASE_HREF } from '@angular/common';

const mockLuigiClient = {
  getEventData: () => { return {
    idToken: 'token'
  }}
}

describe('DeploymentsComponent', () => {
  let component: DeploymentsComponent;
  let fixture: ComponentFixture<DeploymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/my/app' }, 
        { provide: LuigiClient, useValue: mockLuigiClient}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
