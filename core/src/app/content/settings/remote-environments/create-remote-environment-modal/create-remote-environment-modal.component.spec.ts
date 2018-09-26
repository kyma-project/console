import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, empty } from 'rxjs';

import { CreateRemoteEnvironmentModalComponent } from './create-remote-environment-modal.component';
import { RemoteEnvironmentsService } from '../services/remote-environments.service';
import { ComponentCommunicationService } from '../../../../shared/services/component-communication.service';

describe('CreateRemoteEnvironmentModalComponent', () => {
  let component: CreateRemoteEnvironmentModalComponent;
  let fixture: ComponentFixture<CreateRemoteEnvironmentModalComponent>;
  let mockRemoteEnvironmentsService: RemoteEnvironmentsService;
  let mockComponentCommunicationService: ComponentCommunicationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRemoteEnvironmentModalComponent],
      providers: [
        {
          provide: RemoteEnvironmentsService,
          useValue: { createRemoteEnvironment: () => {} }
        },
        {
          provide: ComponentCommunicationService,
          useValue: { sendEvent: () => {} }
        }
        // ComponentCommunicationService
      ]
    })
      .overrideTemplate(CreateRemoteEnvironmentModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRemoteEnvironmentModalComponent);
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
      component.name = 'any-name';
      component.description = 'any-description';
      component.labels = ['any-labels'];
      component['resetForm']();
      expect(component.name).toBe('');
      expect(component.description).toBe('');
      expect(component.labels).toEqual([]);
    });
  });

  describe('isReadyToCreate()', () => {
    it('returns true if name is truthy', () => {
      component.name = 're-name';
      const actual: boolean = component.isReadyToCreate();
      expect(actual).toBe(true);
    });

    it('returns false if name is truthy', () => {
      component.name = '';
      const actual: boolean = component.isReadyToCreate();
      expect(actual).toBe(false);
    });
  });

  describe('updateLabelsData', () => {
    it('updates labels with input value', () => {
      component.labels = [];
      const newLabels = ['key1:val1', 'key2:val:2'];
      component.updateLabelsData(newLabels);
      expect(component.labels).toBe(newLabels);
    });
  });

  describe('save()', () => {
    beforeEach(() => {});

    it('creates new remote env', () => {
      spyOn(
        mockRemoteEnvironmentsService,
        'createRemoteEnvironment'
      ).and.returnValue(empty());
      component.name = 're-name';
      component.description = 're-desc';
      component.labels = ['key1:val1'];
      const expectedData = {
        name: 're-name',
        description: 're-desc',
        labels: ['key1:val1']
      };
      component.save();
      expect(
        mockRemoteEnvironmentsService.createRemoteEnvironment
      ).toHaveBeenCalledWith(expectedData);
    });

    it('handles success on creating remote env', () => {
      spyOn(
        mockRemoteEnvironmentsService,
        'createRemoteEnvironment'
      ).and.returnValue(of({ createRemoteEnvironment: 're-created' }));
      spyOn(mockComponentCommunicationService, 'sendEvent');
      const expectedEventData = {
        type: 'createResource',
        data: 're-created'
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
        'createRemoteEnvironment'
      ).and.returnValue(throwError({ message: 're-not-created' }));
      component.error = null;
      component.save();
      expect(component.error).toBe('Error: re-not-created');
    });
  });
});
