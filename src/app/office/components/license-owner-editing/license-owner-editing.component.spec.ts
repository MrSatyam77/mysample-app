import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseOwnerEditingComponent } from './license-owner-editing.component';

describe('LicenseOwnerEditingComponent', () => {
  let component: LicenseOwnerEditingComponent;
  let fixture: ComponentFixture<LicenseOwnerEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseOwnerEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseOwnerEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
