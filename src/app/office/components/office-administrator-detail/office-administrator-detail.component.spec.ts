import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeAdministratorDetailComponent } from './office-administrator-detail.component';

describe('OfficeAdministratorDetailComponent', () => {
  let component: OfficeAdministratorDetailComponent;
  let fixture: ComponentFixture<OfficeAdministratorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeAdministratorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeAdministratorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
