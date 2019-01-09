import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, EMPTY } from 'rxjs';

import { EditRemoteEnvironmentModalComponent } from './edit-remote-environment-modal.component';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';
import { FormsModule } from '@angular/forms';

describe('EditRemoteEnvironmentModalComponent', () => {
  let component: EditRemoteEnvironmentModalComponent;
  let fixture: ComponentFixture<EditRemoteEnvironmentModalComponent>;
  let mockRemoteEnvironmentsService: RemoteEnvironmentsService;
  let mockComponentCommunicationService: ComponentCommunicationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [EditRemoteEnvironmentModalComponent],
      providers: [
        {
          provide: RemoteEnvironmentsService,
          useValue: { updateRemoteEnvironment: () => {} }
        },
        {
          provide: ComponentCommunicationService,
          useValue: { sendEvent: () => {} }
        }
      ]
    })
      .overrideTemplate(
        EditRemoteEnvironmentModalComponent,
        '<form #editRemoteEnvsForm="ngForm"></form>'
      )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRemoteEnvironmentModalComponent);
    component = fixture.componentInstance;
    mockRemoteEnvironmentsService = TestBed.get(RemoteEnvironmentsService);
    mockComponentCommunicationService = TestBed.get(
      ComponentCommunicationService
    );
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
    it('deactivates the form', () => {
      component.isActive = true;
      component.close();
      expect(component.isActive).toBe(false);
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
      component.editRemoteEnvsForm.control.markAsDirty();
      component.wrongLabels = false;
      component.updatedDescription = 'a-valid-desc';
    });

    it('returns true if fields are valid', () => {
      const actual: boolean = component.isReadyToSave();
      expect(actual).toBe(true);
    });

    it('returns false if form is not dirty', () => {
      component.editRemoteEnvsForm.control.markAsPristine();
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
    it('updates new remote env', () => {
      spyOn(
        mockRemoteEnvironmentsService,
        'updateRemoteEnvironment'
      ).and.returnValue(EMPTY);
      component.name = 're-name';
      component.updatedDescription = 're-desc';
      component.updatedLabels = ['key1=val1'];
      const expectedData = {
        name: 're-name',
        description: 're-desc',
        labels: { key1: 'val1' }
      };
      component.save();
      expect(
        mockRemoteEnvironmentsService.updateRemoteEnvironment
      ).toHaveBeenCalledWith(expectedData);
    });

    it('handles success on creating remote env', () => {
      spyOn(
        mockRemoteEnvironmentsService,
        'updateRemoteEnvironment'
      ).and.returnValue(of('update-success-response'));
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

    it('handles error when creating remote env', () => {
      spyOn(
        mockRemoteEnvironmentsService,
        'updateRemoteEnvironment'
      ).and.returnValue(throwError('re-not-updated'));
      component.error = null;
      component.save();
      expect(component.error).toBe('Error: re-not-updated');
    });
  });
});
