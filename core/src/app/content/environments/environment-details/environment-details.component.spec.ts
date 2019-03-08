import * as LuigiClient from '@kyma-project/luigi-client';
import { AppModule } from './../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { EnvironmentDetailsComponent } from './environment-details.component';

const mockLuigiClient = {
  getEventData: () => {
    return {
      isSystemNamespace: true
    };
  }
};
describe('EnvironmentDetailsComponent', () => {
  let component: EnvironmentDetailsComponent;
  let fixture: ComponentFixture<EnvironmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(LuigiClient, 'getEventData').and.callFake(
      mockLuigiClient.getEventData
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
