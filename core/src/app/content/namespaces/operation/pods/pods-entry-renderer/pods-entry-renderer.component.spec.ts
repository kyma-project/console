import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './../../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PodsEntryRendererComponent } from './pods-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { of, Subject } from 'rxjs';

describe('PodsEntryRendererComponent', () => {
  let component: PodsEntryRendererComponent;
  let fixture: ComponentFixture<PodsEntryRendererComponent>;
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
              metadata: {
                name: 'name'
              },
              status: {
                phase: 'Running',
                containerStatuses: []
              },
              spec: {
                nodeName: 'name'
              }
            }
          }
        ],
        [{ provide: 'entryEventHandler', useValue: {} }],
        ComponentCommunicationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PodsEntryRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentCommunicationService = TestBed.get(ComponentCommunicationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display pod status', () => {
    const waitingStatus = {
      phase: 'Doing something..',
      containerStatuses: [
        {
          state: {
            waiting: {
              reason: 'Some reason'
            }
          }
        }
      ]
    };
    expect(component.getStatus({ status: waitingStatus })).toEqual(
      'Waiting: Some reason'
    );
    const signalStatus = {
      phase: 'Doing something..',
      containerStatuses: [
        {
          state: {
            stopped: {
              signal: 'Some signal'
            }
          }
        }
      ]
    };
    expect(component.getStatus({ status: signalStatus })).toEqual(
      'Stopped (Signal: Some signal)'
    );

    const exitCodeStatus = {
      phase: 'Doing something..',
      containerStatuses: [
        {
          state: {
            foo: {
              exitCode: 'Some exitCode'
            }
          }
        },
        {
          status: {
            bar: {
              exitCode: 'Sample code'
            }
          }
        }
      ]
    };
    expect(component.getStatus({ status: exitCodeStatus })).toEqual(
      'Foo (Exit code: Some exitCode)'
    );

    const otherCodeStatus = {
      phase: 'Doing something..',
      containerStatuses: [
        {
          state: {
            other: {
              foo: 'bar'
            }
          }
        }
      ]
    };
    expect(component.getStatus({ status: otherCodeStatus })).toEqual('Other');
    const noContainerStatesStatus = {
      phase: 'Doing something..'
    };
    expect(component.getStatus({ status: noContainerStatesStatus })).toEqual(
      'Doing something..'
    );
  });

  it("should disable the pod if 'disable' event with right data has been sent", async done => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      metadata: {
        name: 'name'
      },
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

  it("should not disable the pod if 'disable' event with different data has been sent", async done => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      metadata: {
        name: 'name2'
      },
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

  it("should not disable the pod if event type is no 'disable'", async done => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      metadata: {
        name: 'name'
      },
      disabled: false
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
