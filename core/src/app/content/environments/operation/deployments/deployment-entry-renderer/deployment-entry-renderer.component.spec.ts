import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './../../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeploymentEntryRendererComponent } from './deployment-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { of, Subject } from 'rxjs';

describe('DeploymentEntryRendererComponent', () => {
  let component: DeploymentEntryRendererComponent;
  let fixture: ComponentFixture<DeploymentEntryRendererComponent>;
  let componentCommunicationService: ComponentCommunicationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        [{ provide: APP_BASE_HREF, useValue: '/my/app' }],
        [
          {
            provide: 'entry',
            useValue: {
              name: 'entryName',
              status: {
                readyReplicas: 0
              },
              boundServiceInstanceNames: []
            }
          }
        ],
        [{ provide: 'entryEventHandler', useValue: {} }],
        ComponentCommunicationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentEntryRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentCommunicationService = TestBed.get(ComponentCommunicationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should disable the deployment if 'disable' event with rigth data has been sent", async done => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      name: 'entryName',
      disabled: true
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'disable',
        entry
      });
      expect(component.disabled).toEqual(true);

      done();
    });
  });

  it("should not disable the deployment if 'disable' event with different data has been sent", async done => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      name: 'differentEntryName',
      disabled: true
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'disable',
        entry
      });
      expect(component.disabled).toEqual(false);

      done();
    });
  });

  it("should not disable the deployment if event type is no 'disable'", async done => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      name: 'entryName',
      disabled: true
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'diffetentType',
        entry
      });
      expect(component.disabled).toEqual(false);

      done();
    });
  });
});
