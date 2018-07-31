import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './../../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PodsEntryRendererComponent } from './pods-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
              objectMeta: {
                name: 'name'
              },
              podStatus: {
                status: 'Running'
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
    const podStatus = {
      status: 'whatever'
    };
    expect(component.getStatus({ podStatus })).toEqual('whatever');
  });

  it("should disable the pod if 'disable' event with rigth data has been sent", async () => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      objectMeta: {
        name: 'name'
      },
      disabled: true
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      Observable.of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'disable',
        entry
      });
      expect(component.disabled).toEqual(true);
    });
  });

  it("should not disable the pod if 'disable' event with different data has been sent", async () => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      objectMeta: {
        name: 'name2'
      },
      disabled: true
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      Observable.of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'disable',
        entry
      });
      expect(component.disabled).toEqual(false);
    });
  });

  it("should not disable the pod if event type is no 'disable'", async () => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      objectMeta: {
        name: 'name'
      },
      disabled: false
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      Observable.of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'diffetentType',
        entry
      });
      expect(component.disabled).toEqual(false);
    });
  });
});
