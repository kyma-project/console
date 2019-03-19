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
              name: 'name',
              status: 'RUNNING',
              containerStates: [{}]
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

  it('should display pod status any container failed', () => {
    const pod = {
      status: 'PENDING',
      containerStates: [
        {
          state: 'RUNNING',
          reason: '',
          message: ''
        },
        {
          state: 'PENDING',
          reason: 'ImagePullBackOff',
          message: 'Image not found'
        }
      ]
    }
    expect(component.getStatus(pod)).toEqual(
      'PENDING: ImagePullBackOff'
    );

  });

  it('should display pod status if it\'s running', () => {
    const pod = {
      status: 'RUNNING',
      containerStates: [{}]
    };
    expect(component.getStatus(pod)).toEqual(
      'RUNNING'
    );
  });

  it("should disable the pod if 'disable' event with right data has been sent", async done => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      name: 'name',
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
      name: 'name2',
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
