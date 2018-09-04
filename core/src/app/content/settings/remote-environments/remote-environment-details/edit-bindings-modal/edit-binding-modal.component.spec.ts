import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBindingsModalComponent } from './edit-binding-modal.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RemoteEnvironmentsService } from './../../services/remote-environments.service';
import { EnvironmentsService } from '../../../../environments/services/environments.service';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { RemoteEnvironmentBindingService } from './../remote-environment-binding-service';
import { FormsModule } from '@angular/forms';

const ActivatedRouteMock = {
  params: of({ id: 'id' })
};

const RemoteEnvironmentsServiceMock = {
  getRemoteEnvironment() {
    return of({});
  }
};

const EnvironmentsServiceMock = {
  getEnvironments() {
    return of({});
  }
};

const RemoteEnvironmentBindingServiceMock = {
  bind() {
    return of({});
  }
};

describe('EditBindingsModalComponent', () => {
  let component: EditBindingsModalComponent;
  let fixture: ComponentFixture<EditBindingsModalComponent>;
  let RemoteEnvironmentsServiceMockStub: RemoteEnvironmentsService;
  let EnvironmentsServiceMockStub: EnvironmentsService;
  let RemoteEnvironmentBindingServiceMockStub: RemoteEnvironmentBindingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        {
          provide: RemoteEnvironmentsService,
          useValue: RemoteEnvironmentsServiceMock
        },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: EnvironmentsService, useValue: EnvironmentsServiceMock },
        {
          provide: RemoteEnvironmentBindingService,
          useValue: RemoteEnvironmentBindingServiceMock
        },
        ComponentCommunicationService
      ],
      declarations: [EditBindingsModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBindingsModalComponent);
    component = fixture.componentInstance;
    RemoteEnvironmentsServiceMockStub = fixture.debugElement.injector.get(
      RemoteEnvironmentsService
    );
    EnvironmentsServiceMockStub = fixture.debugElement.injector.get(
      EnvironmentsService
    );
    RemoteEnvironmentBindingServiceMockStub = fixture.debugElement.injector.get(
      RemoteEnvironmentBindingService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    // then
    expect(component).toBeTruthy();
    expect(component.environments).toEqual([]);
    expect(component.environments).toEqual([]);
  });

  it('should show and set envs and remoteevns', done => {
    // given
    const remoteEnvs = of({
      remoteEnvironment: {
        enabledInEnvironments: ['env1', 'env2']
      }
    });
    const envs = of([
      {
        label: 'env3'
      },
      {
        label: 'env4'
      }
    ]);
    component.checkIfEnvironmentExists();

    const spyGetRemoteEnvironment = spyOn(
      RemoteEnvironmentsServiceMockStub,
      'getRemoteEnvironment'
    ).and.returnValue(remoteEnvs);
    const spyGetEnvironments = spyOn(
      EnvironmentsServiceMockStub,
      'getEnvironments'
    ).and.returnValue(envs);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    component.show();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetRemoteEnvironment.calls.any()).toBeTruthy();
      expect(spyGetEnvironments.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(
        RemoteEnvironmentsServiceMockStub.getRemoteEnvironment
      ).toHaveBeenCalledTimes(1);
      expect(EnvironmentsServiceMockStub.getEnvironments).toHaveBeenCalledTimes(
        1
      );
      expect(console.log).not.toHaveBeenCalled();
      expect(component.remoteEnv).toEqual({
        enabledInEnvironments: ['env1', 'env2']
      });
      expect(component.environments).toEqual([
        {
          label: 'env3'
        },
        {
          label: 'env4'
        }
      ]);
      expect(component.isActive).toBeTruthy();
      expect(component.checkIfEnvironmentExists()).toBeFalsy();

      done();
    });
  });

  it("should not fail if couldn't get envs", done => {
    // given
    const remoteEnvs = of({
      remoteEnvironment: {
        enabledInEnvironments: ['env1', 'env2']
      }
    });
    const envs = throwError('error');
    component.checkIfEnvironmentExists();

    const spyGetRemoteEnvironment = spyOn(
      RemoteEnvironmentsServiceMockStub,
      'getRemoteEnvironment'
    ).and.returnValue(remoteEnvs);
    const spyGetEnvironments = spyOn(
      EnvironmentsServiceMockStub,
      'getEnvironments'
    ).and.returnValue(envs);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    component.show();

    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
      expect(spyGetRemoteEnvironment.calls.any()).toBeTruthy();
      expect(spyGetEnvironments.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeTruthy();
      expect(
        RemoteEnvironmentsServiceMockStub.getRemoteEnvironment
      ).toHaveBeenCalledTimes(1);
      expect(EnvironmentsServiceMockStub.getEnvironments).toHaveBeenCalledTimes(
        1
      );
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(component.remoteEnv).toEqual(undefined);
      expect(component.environments).toEqual([]);
      expect(component.isActive).toBeTruthy();
      expect(component.checkIfEnvironmentExists()).toBeFalsy();

      done();
    });
  });

  it('should react on Save event', async done => {
    // given
    component.isActive = true;
    component.remoteEnv = {
      name: 'test'
    };
    const remoteEnvs = of({
      remoteEnvironment: {
        name: 'test',
        enabledInEnvironments: ['env1', 'env2']
      }
    });
    const envs = of([
      {
        label: 'env3'
      },
      {
        label: 'env4'
      }
    ]);
    component.checkIfEnvironmentExists();

    const spyGetRemoteEnvironment = spyOn(
      RemoteEnvironmentsServiceMockStub,
      'getRemoteEnvironment'
    ).and.returnValue(remoteEnvs);
    const spyGetEnvironments = spyOn(
      EnvironmentsServiceMockStub,
      'getEnvironments'
    ).and.returnValue(envs);
    const spyConsoleLog = spyOn(console, 'log');
    const spyBind = spyOn(
      RemoteEnvironmentBindingServiceMockStub,
      'bind'
    ).and.returnValue(of({ data: 'created' }));

    // when
    component.selectedEnv({ label: 'env3' });
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.isActive).toBeFalsy();
      expect(spyBind.calls.any()).toBeTruthy();
      expect(
        RemoteEnvironmentBindingServiceMockStub.bind
      ).toHaveBeenCalledTimes(1);

      done();
    });
  });
});
