import { LuigiClientCommunicationDirective } from './../../directives/luigi-client-communication/luigi-client-communication.directive';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleBindingModalComponent } from './role-binding-modal.component';
import { Observable, of, throwError } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-communication.service';
import { RbacService } from '../../services/rbac.service';
import { CurrentEnvironmentService } from '../../../content/environments/services/current-environment.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from 'fundamental-ngx';

const RbacServiceMock = {
  getClusterRoles() {
    return of({});
  },
  getRoles() {
    return of({});
  },
  createClusterRoleBinding() {
    return of({});
  },
  createRoleBinding() {
    return of({});
  }
};

const CurrentEnvironmentServiceMock = {
  getCurrentEnvironmentId() {
    return of('currentId');
  }
};

describe('RoleBindingModalComponent', () => {
  let component: RoleBindingModalComponent;
  let fixture: ComponentFixture<RoleBindingModalComponent>;
  let RbacServiceMockStub: RbacService;
  let CurrentEnvironmentServiceMockStub: CurrentEnvironmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        {
          provide: RbacService,
          useValue: RbacServiceMock
        },
        {
          provide: CurrentEnvironmentService,
          useValue: CurrentEnvironmentServiceMock
        },
        {
          provide: ModalService,
          useValue: { close: () => {} }
        },
        ComponentCommunicationService
      ],
      declarations: [
        RoleBindingModalComponent,
        LuigiClientCommunicationDirective
      ]
    })
      .overrideTemplate(RoleBindingModalComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleBindingModalComponent);
    component = fixture.componentInstance;
    RbacServiceMockStub = fixture.debugElement.injector.get(RbacService);
    CurrentEnvironmentServiceMockStub = fixture.debugElement.injector.get(
      CurrentEnvironmentService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    // then
    expect(component).toBeTruthy();
    expect(component.isActive).toBeFalsy();
    expect(component.roles).toEqual([]);
    expect(component.filteredRoles).toEqual([]);
  });

  it('should get the list of cluster roles', async done => {
    // given
    const clusterRoles = of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isReadyToCreate();

    const spyGetClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getClusterRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetClusterRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual(['user1', 'user2']);
      expect(component.filteredRoles).toEqual(['user1', 'user2']);

      done();
    });
  });

  it('should not fail if gets wrong data', async done => {
    // given
    const clusterRoles = of({
      items: ''
    });
    component.isReadyToCreate();

    const spyGetClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getClusterRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetClusterRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);

      done();
    });
  });

  it('should catch an error', async done => {
    // given
    const clusterRoles = throwError('Error');
    component.isReadyToCreate();

    const spyClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getClusterRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyClusterRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeTruthy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);

      done();
    });
  });

  it('should get the list of roles', async done => {
    // given
    const roles = of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual(['user1', 'user2']);
      expect(component.filteredRoles).toEqual(['user1', 'user2']);

      done();
    });
  });

  it('should not fail if gets wrong data', async done => {
    // given
    const roles = of({
      items: ''
    });
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);

      done();
    });
  });

  it('should catch an error', async done => {
    // given
    const roles = throwError('Error');
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyConsoleLog = spyOn(console, 'log');

    // when
    fixture.detectChanges();
    await component.getRoles();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeTruthy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(component.roles).toEqual([]);
      expect(component.filteredRoles).toEqual([]);

      done();
    });
  });

  it('should react on Save event with Role, on Permissions view', async done => {
    // given
    const roles = of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isActive = true;
    component.isGlobalPermissionsView = false;
    component.isUserGroupMode = true;
    component.userOrGroup = 'group';
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyCreateRoleBinding = spyOn(
      RbacServiceMockStub,
      'createRoleBinding'
    ).and.returnValue(of({ data: 'created' }));
    const spyConsoleLog = spyOn(console, 'log');

    // when
    component.selectKind('Role');
    component.selectRole('user1');
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.isGlobalPermissionsView).toBeFalsy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyCreateRoleBinding.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(RbacServiceMockStub.createRoleBinding).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();

      done();
    });
  });

  it('should react on Save event with Role for User, on Permissions view', async done => {
    // given
    const roles = of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isActive = true;
    component.isGlobalPermissionsView = false;
    component.isUserGroupMode = false;
    component.userOrGroup = 'user';
    component.isReadyToCreate();

    const spyGetRoles = spyOn(RbacServiceMockStub, 'getRoles').and.returnValue(
      roles
    );
    const spyCreateRoleBinding = spyOn(
      RbacServiceMockStub,
      'createRoleBinding'
    ).and.returnValue(of({ data: 'created' }));
    const spyConsoleLog = spyOn(console, 'log');

    // when
    component.selectKind('Role');
    component.selectRole('user1');
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.isGlobalPermissionsView).toBeFalsy();
      expect(spyGetRoles.calls.any()).toBeTruthy();
      expect(spyCreateRoleBinding.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getRoles).toHaveBeenCalledTimes(1);
      expect(RbacServiceMockStub.createRoleBinding).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();

      done();
    });
  });

  it('should react on Save event with ClusterRole, on GlobalPermissions view', async done => {
    // given
    const clusterRoles = of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isActive = true;
    component.isGlobalPermissionsView = true;
    component.isUserGroupMode = true;
    component.userOrGroup = 'group';
    component.isReadyToCreate();

    const spyGetClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyCreateClusterRoleBinding = spyOn(
      RbacServiceMockStub,
      'createClusterRoleBinding'
    ).and.returnValue(of({ data: 'created' }));
    const spyConsoleLog = spyOn(console, 'log');

    // when
    component.selectKind('ClusterRole');
    component.selectRole('user1');
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.isGlobalPermissionsView).toBeTruthy();
      expect(spyGetClusterRoles.calls.any()).toBeTruthy();
      expect(spyCreateClusterRoleBinding.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(
        RbacServiceMockStub.createClusterRoleBinding
      ).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();

      done();
    });
  });

  it('should react on Save event with ClusterRole for User, on GlobalPermissions view', async done => {
    // given
    const clusterRoles = of({
      items: [
        {
          metadata: {
            name: 'user1'
          }
        },
        {
          metadata: {
            name: 'user2'
          }
        }
      ]
    });
    component.isActive = true;
    component.isGlobalPermissionsView = true;
    component.isUserGroupMode = false;
    component.userOrGroup = 'user';
    component.isReadyToCreate();

    const spyGetClusterRoles = spyOn(
      RbacServiceMockStub,
      'getClusterRoles'
    ).and.returnValue(clusterRoles);
    const spyCreateClusterRoleBinding = spyOn(
      RbacServiceMockStub,
      'createClusterRoleBinding'
    ).and.returnValue(of({ data: 'created' }));
    const spyConsoleLog = spyOn(console, 'log');

    // when
    component.selectKind('ClusterRole');
    component.selectRole('user1');
    fixture.detectChanges();
    await component.save();

    fixture.whenStable().then(() => {
      // then
      expect(component).toBeTruthy();
      expect(component.isGlobalPermissionsView).toBeTruthy();
      expect(spyGetClusterRoles.calls.any()).toBeTruthy();
      expect(spyCreateClusterRoleBinding.calls.any()).toBeTruthy();
      expect(spyConsoleLog.calls.any()).toBeFalsy();
      expect(RbacServiceMockStub.getClusterRoles).toHaveBeenCalledTimes(1);
      expect(
        RbacServiceMockStub.createClusterRoleBinding
      ).toHaveBeenCalledTimes(1);
      expect(console.log).not.toHaveBeenCalled();

      done();
    });
  });
});
