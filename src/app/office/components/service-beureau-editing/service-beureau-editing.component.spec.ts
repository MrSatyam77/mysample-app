import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBeureauEditingComponent } from './service-beureau-editing.component';

describe('ServiceBeureauEditingComponent', () => {
  let component: ServiceBeureauEditingComponent;
  let fixture: ComponentFixture<ServiceBeureauEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceBeureauEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBeureauEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
