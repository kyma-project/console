import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './../../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplicaSetsEntryRendererComponent } from './replica-sets-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Subject, of } from 'rxjs';

describe('ReplicaSetsEntryRendererComponent', () => {
  let component: ReplicaSetsEntryRendererComponent;
  let fixture: ComponentFixture<ReplicaSetsEntryRendererComponent>;
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
                name: 'name',
                labels: []
              },
              pods: {
                warnings: [],
                pending: []
              },
              spec: {
                template: {
                  spec: {
                    containers: []
                  }
                }
              },
              status: {}
            }
          }
        ],
        [{ provide: 'entryEventHandler', useValue: {} }],
        ComponentCommunicationService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicaSetsEntryRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentCommunicationService = TestBed.get(ComponentCommunicationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should disable the replica set if 'disable' event with right data has been sent", async done => {
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

  it("should not disable the replica set if 'disable' event with different data has been sent", async done => {
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

  it("should not disable the replica set if event type is no 'disable'", async done => {
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
