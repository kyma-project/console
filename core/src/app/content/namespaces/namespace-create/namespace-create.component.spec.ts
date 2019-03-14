import { AppModule } from '../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NamespaceCreateComponent } from './namespace-create.component';

describe('NamespaceCreateComponent', () => {
  let component: NamespaceCreateComponent;
  let fixture: ComponentFixture<NamespaceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [[{ provide: APP_BASE_HREF, useValue: '/my/app' }]]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NamespaceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
