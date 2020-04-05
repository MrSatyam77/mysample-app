import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EfinDetailComponent } from './efin-detail.component';

describe('EfinDetailComponent', () => {
  let component: EfinDetailComponent;
  let fixture: ComponentFixture<EfinDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfinDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfinDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
