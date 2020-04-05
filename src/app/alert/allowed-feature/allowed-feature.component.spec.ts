import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowedFeatureComponent } from './allowed-feature.component';

describe('AllowedFeatureComponent', () => {
  let component: AllowedFeatureComponent;
  let fixture: ComponentFixture<AllowedFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowedFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowedFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
