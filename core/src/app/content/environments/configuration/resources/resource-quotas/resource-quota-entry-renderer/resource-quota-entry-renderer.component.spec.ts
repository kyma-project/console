import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceQuotaEntryRendererComponent } from './resource-quota-entry-renderer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentCommunicationService } from '../../../../../../shared/services/component-communication.service';
import { Observable, of } from 'rxjs';

describe('ResourceQuotasEntryRendererComponent', () => {
  let component: ResourceQuotaEntryRendererComponent;
  let fixture: ComponentFixture<ResourceQuotaEntryRendererComponent>;
  let componentCommunicationService: ComponentCommunicationService;

  class MockComponentCommunicationService {
    public observable$: Observable<{}> = of({});
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceQuotaEntryRendererComponent],
      providers: [
        {
          provide: ComponentCommunicationService,
          useClass: MockComponentCommunicationService
        },
        {
          provide: 'entry',
          useValue: {
            name: 'name',
            pods: '3',
            limits: {
              memory: '1',
              cpu: '1'
            },
            requests: {
              memory: '1',
              cpu: '1'
            }
          }
        },
        { provide: 'entryEventHandler', useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceQuotaEntryRendererComponent);
    component = fixture.componentInstance;
    componentCommunicationService = TestBed.get(ComponentCommunicationService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set disabled to true if disable event has been sent', () => {
      const entry = {
        name: 'name',
        disabled: true
      };
      const b = {
        type: 'disable',
        entry
      };
      componentCommunicationService.observable$ = of(b);
      fixture.detectChanges();
      expect(component.disabled).toEqual(true);
    });

    it('should set disabled to false if disable event with disable property set to false, has been sent', () => {
      const entry = {
        name: 'name',
        disabled: false
      };
      const b = {
        type: 'disable',
        entry
      };
      componentCommunicationService.observable$ = of(b);
      fixture.detectChanges();
      expect(component.disabled).toEqual(false);
    });

    it("shouldn't do anything if event sent has different type than disable", () => {
      const entry = {
        name: 'name',
        disabled: true
      };
      const b = {
        type: 'other',
        entry
      };
      componentCommunicationService.observable$ = of(b);
      fixture.detectChanges();
      expect(component.disabled).toEqual(false);
    });

    it("shouldn't do anything if event sent corresponds to different entry", () => {
      const entry = {
        name: 'differentName',
        disabled: true
      };
      const b = {
        type: 'disable',
        entry
      };
      componentCommunicationService.observable$ = of(b);
      fixture.detectChanges();
      expect(component.disabled).toEqual(false);
    });
  });
});
