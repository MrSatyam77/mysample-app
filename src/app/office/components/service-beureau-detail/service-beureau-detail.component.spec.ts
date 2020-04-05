import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBeureauDetailComponent } from './service-beureau-detail.component';

describe('ServiceBeureauDetailComponent', () => {
  let component: ServiceBeureauDetailComponent;
  let fixture: ComponentFixture<ServiceBeureauDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceBeureauDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBeureauDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
