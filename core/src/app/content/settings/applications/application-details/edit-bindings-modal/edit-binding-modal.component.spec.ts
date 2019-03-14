import { LuigiClientCommunicationDirective } from './../../../../../shared/directives/luigi-client-communication/luigi-client-communication.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBindingsModalComponent } from './edit-binding-modal.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApplicationsService } from '../../services/applications.service';
import { NamespacesService } from '../../../../namespaces/services/namespaces.service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { ApplicationBindingService } from '../application-binding-service';
import { FormsModule } from '@angular/forms';
import { ModalService } from 'fundamental-ngx';

const ActivatedRouteMock = {
  params: of({ id: 'id' })
};

const ApplicationsServiceMock = {
  getApplication() {
    return of({});
  }
};

const NamespacesServiceMock = {
  getNamespaces() {
    return of({});
  }
};

const ApplicationBindingServiceMock = {
  bind() {
    return of({});
  }
};

describe('EditBindingsModalComponent', () => {
  let component: EditBindingsModalComponent;
  let fixture: ComponentFixture<EditBindingsModalComponent>;
  let ApplicationsServiceMockStub: ApplicationsService;
  let NamespacesServiceMockStub: NamespacesService;
  let ApplicationBindingServiceMockStub: ApplicationBindingService;
  let ComponentCommunicationServiceMockStub: ComponentCommunicationService;
  const modalService = {
    open: () => ({
      result: { finally: () => {} }
    }),
    close: () => {}
  };
  const ComponentCommunicationServiceMock = {
    sendEvent: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        {
          provide: ApplicationsService,
          useValue: ApplicationsServiceMock
        },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: NamespacesService, useValue: NamespacesServiceMock },
        {
          provide: ApplicationBindingService,
          useValue: ApplicationBindingServiceMock
        },
        {
          provide: ModalService,
          useValue: modalService
        },
        {
          provide: ComponentCommunicationService,
          useValue: ComponentCommunicationServiceMock
        }
      ],
      declarations: [
        EditBindingsModalComponent,
        LuigiClientCommunicationDirective
      ]
    })
      .overrideTemplate(EditBindingsModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBindingsModalComponent);
    component = fixture.componentInstance;
    ApplicationsServiceMockStub = fixture.debugElement.injector.get(
      ApplicationsService
    );
    NamespacesServiceMockStub = fixture.debugElement.injector.get(
      NamespacesService
    );
    ApplicationBindingServiceMockStub = fixture.debugElement.injector.get(
      ApplicationBindingService
    );
    ComponentCommunicationServiceMockStub = fixture.debugElement.injector.get(
      ComponentCommunicationService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    // then
    expect(component).toBeTruthy();
    expect(component.namespaces).toEqual([]);
    expect(component.namespaces).toEqual([]);
  });

  it('should show and set namespaces and applications', done => {
    // given
    const applications = of({
      application: {
        enabledInNamespaces: ['namespace1', 'namespace2']
      }
    });
    const namespaces = of([
      {
        label: 'namespace3'
      },
      {
        label: 'namespace4'
      }
    ]);
    component.checkIfNamespaceExists();

    const spyGetApplication = spyOn(
      ApplicationsServiceMockStub,
      'getApplication'
    ).and.returnValue(applications);
    const spyGetNamespaces = spyOn(
      NamespacesServiceMockStub,
      'getNamespaces'
    ).and.returnValue(namespaces);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    component.show();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetApplication.calls.any()).toBeTruthy();
      expect(spyGetNamespaces.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(
        ApplicationsServiceMockStub.getApplication
      ).toHaveBeenCalledTimes(1);
      expect(NamespacesServiceMockStub.getNamespaces).toHaveBeenCalledTimes(
        1
      );
      expect(console.log).not.toHaveBeenCalled();
      expect(component.application).toEqual({
        enabledInNamespaces: ['namespace1', 'namespace2']
      });
      expect(component.namespaces).toEqual([
        {
          label: 'namespace3'
        },
        {
          label: 'namespace4'
        }
      ]);
      expect(component.isActive).toBeTruthy();
      expect(component.checkIfNamespaceExists()).toBeFalsy();

      done();
    });
  });

  it("should not fail if couldn't get namespaces", done => {
    // given
    const applications = of({
      application: {
        enabledInNamespaces: ['namespace1', 'namespace2']
      }
    });
    const namespaces = throwError('error');
    component.checkIfNamespaceExists();

    const spyGetApplication = spyOn(
      ApplicationsServiceMockStub,
      'getApplication'
    ).and.returnValue(applications);
    const spyGetNamespaces = spyOn(
      NamespacesServiceMockStub,
      'getNamespaces'
    ).and.returnValue(namespaces);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    component.show();

    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
      expect(spyGetApplication.calls.any()).toBeTruthy();
      expect(spyGetNamespaces.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeTruthy();
      expect(
        ApplicationsServiceMockStub.getApplication
      ).toHaveBeenCalledTimes(1);
      expect(NamespacesServiceMockStub.getNamespaces).toHaveBeenCalledTimes(
        1
      );
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(component.application).toEqual(undefined);
      expect(component.namespaces).toEqual([]);
      expect(component.isActive).toBeTruthy();
      expect(component.checkIfNamespaceExists()).toBeFalsy();

      done();
    });
  });

  it('should react on Save event', async done => {
    // given
    component.application = {
      name: 'test'
    };
    component.checkIfNamespaceExists();

    const spyBind = spyOn(
      ApplicationBindingServiceMockStub,
      'bind'
    ).and.returnValue(of({ data: 'created' }));

    spyOn(ComponentCommunicationServiceMockStub, 'sendEvent');

    // when
    component.selectedNamespace({ label: 'namespace3' });
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyBind.calls.any()).toBeTruthy('spyBind.calls.any');
      expect(
        ApplicationBindingServiceMockStub.bind
      ).toHaveBeenCalledTimes(1);

      expect(
        ComponentCommunicationServiceMockStub.sendEvent
      ).toHaveBeenCalledWith({
        type: 'updateResource',
        data: { data: 'created' }
      });
      done();
    });
  });
});
