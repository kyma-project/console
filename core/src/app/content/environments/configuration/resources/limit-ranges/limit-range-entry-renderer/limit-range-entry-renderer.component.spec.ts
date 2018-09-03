import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LimitRangeEntryRendererComponent } from './limit-range-entry-renderer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentCommunicationService } from '../../../../../../shared/services/component-communication.service';
import { Subject, of } from 'rxjs';

describe('LimitRangeEntryRendererComponent', () => {
  let component: LimitRangeEntryRendererComponent;
  let fixture: ComponentFixture<LimitRangeEntryRendererComponent>;
  let componentCommunicationService: ComponentCommunicationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LimitRangeEntryRendererComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        ComponentCommunicationService,
        {
          provide: 'entry',
          useValue: {
            name: 'name',
            limits: [
              {
                limitType: 'Container',
                default: {
                  memory: '1',
                  cpu: '1'
                },
                max: {
                  memory: '1',
                  cpu: '1'
                },
                defaultRequest: {
                  memory: '1',
                  cpu: '1'
                }
              }
            ]
          }
        },
        { provide: 'entryEventHandler', useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitRangeEntryRendererComponent);
    component = fixture.componentInstance;
    componentCommunicationService = TestBed.get(ComponentCommunicationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set disabled to true if disable event has been sent', async () => {
      const subject = new Subject();
      const entry = {
        name: 'name',
        disabled: true
      };
      spyOn(componentCommunicationService, 'observable$').and.returnValue(
        of(subject.next(entry))
      );
      fixture.whenStable().then(async () => {
        fixture.detectChanges();
        await componentCommunicationService.sendEvent({
          type: 'disable',
          entry
        });
        expect(component.disabled).toEqual(true);
      });
    });

    it('should set disabled to false if disable event with disable property set to false, has been sent', async () => {
      const subject = new Subject();
      const entry = {
        name: 'name',
        disabled: false
      };
      spyOn(componentCommunicationService, 'observable$').and.returnValue(
        of(subject.next(entry))
      );
      fixture.whenStable().then(async () => {
        fixture.detectChanges();
        await componentCommunicationService.sendEvent({
          type: 'disable',
          entry
        });
        expect(component.disabled).toEqual(false);
      });
    });

    it("shouldn't do anything if event sent has diffetent type than disable", async () => {
      const subject = new Subject();
      const entry = {
        name: 'name',
        disabled: true
      };
      spyOn(componentCommunicationService, 'observable$').and.returnValue(
        of(subject.next(entry))
      );
      fixture.whenStable().then(async () => {
        fixture.detectChanges();
        await componentCommunicationService.sendEvent({
          type: 'other',
          entry
        });
        expect(component.disabled).toEqual(false);
      });
    });

    it("shouldn't do anything if event sent corresponds to different entry", async () => {
      const subject = new Subject();
      const entry = {
        name: 'differentName',
        disabled: true
      };
      spyOn(componentCommunicationService, 'observable$').and.returnValue(
        of(subject.next(entry))
      );
      fixture.whenStable().then(async () => {
        fixture.detectChanges();
        await componentCommunicationService.sendEvent({
          type: 'disable',
          entry
        });
        expect(component.disabled).toEqual(false);
      });
    });
  });
});
