import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LambdasHeaderRendererComponent } from './lambdas-header-renderer.component';
import { LuigiClientService } from '../../../shared/services/luigi-client.service';

describe('LambdasHeaderRenderer', () => {
  let component: LambdasHeaderRendererComponent;
  let fixture: ComponentFixture<LambdasHeaderRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LambdasHeaderRendererComponent ],
      providers: [ LuigiClientService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LambdasHeaderRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
