import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeAdministratorEditingComponent } from './office-administrator-editing.component';

describe('OfficeAdministratorEditingComponent', () => {
  let component: OfficeAdministratorEditingComponent;
  let fixture: ComponentFixture<OfficeAdministratorEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeAdministratorEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeAdministratorEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
