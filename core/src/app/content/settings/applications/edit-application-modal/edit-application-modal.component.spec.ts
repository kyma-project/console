import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, EMPTY } from 'rxjs';

import { EditApplicationModalComponent } from './edit-application-modal.component';
import { ApplicationsService } from '../services/applications.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from 'fundamental-ngx';

describe('EditApplicationModalComponent', () => {
  let component: EditApplicationModalComponent;
  let fixture: ComponentFixture<EditApplicationModalComponent>;
  let mockApplicationsService: ApplicationsService;
  let mockComponentCommunicationService: ComponentCommunicationService;
  let mockModalService: ModalService;
  const modalService = {
    open: () => ({
      afterClosed: {
        toPromise: () => ({ finally: () => {} })
      }
    }),
    dismissAll: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [EditApplicationModalComponent],
      providers: [
        {
          provide: ApplicationsService,
          useValue: { updateApplication: () => {} }
        },
        {
          provide: ComponentCommunicationService,
          useValue: { sendEvent: () => {} }
        },
        {
          provide: ModalService,
          useValue: modalService
        }
      ]
    })
      .overrideTemplate(
        EditApplicationModalComponent,
        '<form #editApplicationsForm="ngForm"></form>'
      )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditApplicationModalComponent);
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

    it('deactivates the form finally', () => {
      spyOn(mockModalService, 'open').and.returnValue({
        afterClosed: {
          toPromise: () => ({
            finally: fn => fn()
          })
        }
      });
      component.isActive = true;
      component.show();
      expect(component.isActive).toBe(false);
    });
  });

  describe('close()', () => {
    it('deactivates the form', () => {
      spyOn(mockModalService, 'dismissAll');
      (component.editApplicationModal as any) = 'mock-value';
      component.close();
      expect(mockModalService.dismissAll).toHaveBeenCalled();
      expect(component.isActive).toBeFalsy();
    });
  });

  describe('resetForm()', () => {
    it('resets form values', () => {
      component.error = 'any-error';
      component.wrongLabels = true;
      component['resetForm']();
      expect(component.error).toBe('');
      expect(component.wrongLabels).toBe(false);
    });
  });

  describe('isReadyToSave()', () => {
    beforeEach(() => {
      component.editApplicationsForm.control.markAsDirty();
      component.wrongLabels = false;
      component.updatedDescription = 'a-valid-desc';
    });

    it('returns true if fields are valid', () => {
      const actual: boolean = component.isReadyToSave();
      expect(actual).toBe(true);
    });

    it('returns false if form is not dirty', () => {
      component.editApplicationsForm.control.markAsPristine();
      const actual: boolean = component.isReadyToSave();
      expect(actual).toBe(false);
    });

    it('returns false if description input is empty', () => {
      component.updatedDescription = '';
      const actual: boolean = component.isReadyToSave();
      expect(actual).toBe(false);
    });

    it('returns false if labels are not valid', () => {
      component.wrongLabels = true;
      const actual: boolean = component.isReadyToSave();
      expect(actual).toBe(false);
    });
  });

  describe('updateLabelsData', () => {
    it('updates labels with input value', () => {
      component.initialLabels = ['key1=val1'];
      component.updateLabelsData({ labels: ['key1=val1', 'key2=val=2'] });
      expect(component.updatedLabels).toEqual(['key1=val1', 'key2=val=2']);
    });

    it('does not update labels if no input value', () => {
      component.updatedLabels = ['key1=val1'];
      component.updateLabelsData({});
      expect(component.updatedLabels).toEqual(['key1=val1']);
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
    it('updates new application', () => {
      spyOn(mockApplicationsService, 'updateApplication').and.returnValue(
        EMPTY
      );
      component.name = 're-name';
      component.updatedDescription = 're-desc';
      component.updatedLabels = ['key1=val1'];
      const expectedData = {
        name: 're-name',
        description: 're-desc',
        labels: { key1: 'val1' }
      };
      component.save();
      expect(mockApplicationsService.updateApplication).toHaveBeenCalledWith(
        expectedData
      );
    });

    it('handles success on creating application', () => {
      spyOn(mockApplicationsService, 'updateApplication').and.returnValue(
        of('update-success-response')
      );
      spyOn(mockComponentCommunicationService, 'sendEvent');
      const expectedEventData = {
        type: 'updateResource',
        data: 'update-success-response'
      };
      spyOn(component, 'close');

      component.save();
      expect(component.close).toHaveBeenCalled();
      expect(mockComponentCommunicationService.sendEvent).toHaveBeenCalledWith(
        expectedEventData
      );
    });

    it('handles error when creating application', () => {
      spyOn(mockApplicationsService, 'updateApplication').and.returnValue(
        throwError('re-not-updated')
      );
      component.error = null;
      component.save();
      expect(component.error).toBe('Error: re-not-updated');
    });
  });
});
