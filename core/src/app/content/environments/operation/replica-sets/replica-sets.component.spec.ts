import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplicaSetsComponent } from './replica-sets.component';
import { AppModule } from '../../../../app.module';
import { ListModule } from '@kyma-project/y-generic-list';
import { APP_BASE_HREF } from '@angular/common';

describe('ReplicaSetsComponent', () => {
  let component: ReplicaSetsComponent;
  let fixture: ComponentFixture<ReplicaSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, ListModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicaSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
