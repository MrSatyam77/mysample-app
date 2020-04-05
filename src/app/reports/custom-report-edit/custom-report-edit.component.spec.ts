import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomReportEditComponent } from './custom-report-edit.component';

describe('CustomReportEditComponent', () => {
  let component: CustomReportEditComponent;
  let fixture: ComponentFixture<CustomReportEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomReportEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
