import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFeatureUpdateComponent } from './new-feature-update.component';

describe('NewFeatureUpdateComponent', () => {
  let component: NewFeatureUpdateComponent;
  let fixture: ComponentFixture<NewFeatureUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFeatureUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFeatureUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
