import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationMissingInfoComponent } from './verification-missing-info.component';

describe('VerificationMissingInfoComponent', () => {
  let component: VerificationMissingInfoComponent;
  let fixture: ComponentFixture<VerificationMissingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificationMissingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationMissingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
