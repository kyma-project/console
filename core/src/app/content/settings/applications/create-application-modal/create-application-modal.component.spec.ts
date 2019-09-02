import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { ModalService } from 'fundamental-ngx';

import { CreateApplicationModalComponent } from './create-application-modal.component';
import { ApplicationsService } from '../services/applications.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';

describe('CreateApplicationModalComponent', () => {
  let component: CreateApplicationModalComponent;
  let fixture: ComponentFixture<CreateApplicationModalComponent>;
  let mockApplicationsService: ApplicationsService;
  let mockComponentCommunicationService: ComponentCommunicationService;
  let mockModalService: ModalService;

  const modalServiceMock = {
    dismissAll: () => {},
    open: () => {
      return {
        afterClosed: {
          toPromise: () => new Promise(res => res())
        }
      };
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateApplicationModalComponent],
      providers: [
        {
          provide: ApplicationsService,
          useValue: { createApplication: () => {} }
        },
        {
          provide: ComponentCommunicationService,
          useValue: { sendEvent: () => {} }
        },
        {
          provide: ModalService,
          useValue: modalServiceMock
        }
      ]
    })
      .overrideTemplate(CreateApplicationModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApplicationModalComponent);
    component = fixture.componentInstance;
    mockApplicationsService = TestBed.get(ApplicationsService);
    mockComponentCommunicationService = TestBed.get(
      ComponentCommunicationService
    );
    mockModalService = TestBed.get(ModalService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('show()', () => {
    it('resets the form', () => {
      component['resetForm'] = jasmine.createSpy('resetForm');
      component.show();
      expect(component['resetForm']).toHaveBeenCalled();
    });

    it('activates the form', () => {
      component.isActive = false;
      component.show();
      expect(component.isActive).toBe(true);
    });
  });

  describe('close()', () => {
    it('deactivates the form finally', () => {
      spyOn(mockModalService, 'dismissAll');
      (component.createApplicationModal as any) = 'mock-value';
      component.close();
      expect(mockModalService.dismissAll).toHaveBeenCalled();
    });
  });

  describe('resetForm()', () => {
    it('resets form data values', () => {
      component.name = 'any-name';
      component.description = 'any-description';
      component.labels = ['any-labels'];
      component['resetForm']();
      expect(component.name).toBe('');
      expect(component.description).toBe('');
      expect(component.labels).toEqual([]);
    });

    it('resets form validation values', () => {
      component.error = 'any-error';
      component.wrongApplicationName = true;
      component.wrongLabels = true;
      component['resetForm']();
      expect(component.error).toBe('');
      expect(component.wrongApplicationName).toBe(false);
      expect(component.wrongLabels).toBe(false);
    });
  });

  describe('isReadyToCreate()', () => {
    beforeEach(() => {
      component.wrongLabels = false;
      component.wrongApplicationName = false;
      component.name = 'a-valid-name';
      component.description = 'a-valid-desc';
    });

    it('returns true if fields are valid', () => {
      const actual: boolean = component.isReadyToCreate();
      expect(actual).toBe(true);
    });

    it('returns true if description input is empty', () => {
      component.description = '';
      const actual: boolean = component.isReadyToCreate();
      expect(actual).toBe(true);
    });

    it('returns false if name input is empty', () => {
      component.name = '';
      const actual: boolean = component.isReadyToCreate();
      expect(actual).toBe(false);
    });

    it('returns false if name is not valid', () => {
      component.wrongApplicationName = true;
      const actual: boolean = component.isReadyToCreate();
      expect(actual).toBe(false);
    });

    it('returns false if labels are not valid', () => {
      component.wrongLabels = true;
      const actual: boolean = component.isReadyToCreate();
      expect(actual).toBe(false);
    });
  });

  describe('updateLabelsData', () => {
    it('updates labels with input value', () => {
      component.labels = ['key1=val1'];
      component.updateLabelsData({ labels: ['key1=val1', 'key2=val=2'] });
      expect(component.labels).toEqual(['key1=val1', 'key2=val=2']);
    });

    it('does not update labels if no input value', () => {
      component.labels = ['key1=val1'];
      component.updateLabelsData({});
      expect(component.labels).toEqual(['key1=val1']);
    });

    it('updates labels validation field with input value', () => {
      component.wrongLabels = false;
      component.updateLabelsData({ wrongLabels: true });
      expect(component.wrongLabels).toBe(true);
    });

    it('does not update labels validation field if no input value', () => {
      component.wrongLabels = false;
      component.updateLabelsData({});
      expect(component.wrongLabels).toBe(false);
    });
  });

  describe('save()', () => {
    it('creates new application', () => {
      spyOn(mockApplicationsService, 'createApplication').and.returnValue(
        EMPTY
      );
      component.name = 're-name';
      component.description = 're-desc';
      component.labels = ['key1=val1'];
      const expectedData = {
        name: 're-name',
        description: 're-desc',
        labels: { key1: 'val1' }
      };
      component.save();
      expect(mockApplicationsService.createApplication).toHaveBeenCalledWith(
        expectedData
      );
    });

    it('handles success on creating application', () => {
      spyOn(mockApplicationsService, 'createApplication').and.returnValue(
        of('create-success-response')
      );
      spyOn(mockComponentCommunicationService, 'sendEvent');
      const expectedEventData = {
        type: 'createResource',
        data: 'create-success-response'
      };
      spyOn(component, 'close');

      component.save();
      expect(component.close).toHaveBeenCalled();
      expect(mockComponentCommunicationService.sendEvent).toHaveBeenCalledWith(
        expectedEventData
      );
    });

    it('handles error when creating application', () => {
      spyOn(mockApplicationsService, 'createApplication').and.returnValue(
        throwError('re-not-created')
      );
      component.error = null;
      component.save();
      expect(component.error).toBe('Error: re-not-created');
    });
  });
});
