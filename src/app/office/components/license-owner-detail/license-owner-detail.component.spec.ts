import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseOwnerDetailComponent } from './license-owner-detail.component';

describe('LicenseOwnerDetailComponent', () => {
  let component: LicenseOwnerDetailComponent;
  let fixture: ComponentFixture<LicenseOwnerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseOwnerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseOwnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
