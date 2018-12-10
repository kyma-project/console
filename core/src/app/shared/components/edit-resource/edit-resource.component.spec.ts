import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditResourceComponent } from './edit-resource.component';
import { AppModule } from '../../../app.module';
import { APP_BASE_HREF } from '@angular/common';

describe('EditResourceComponent', () => {
  let component: EditResourceComponent;
  let fixture: ComponentFixture<EditResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
