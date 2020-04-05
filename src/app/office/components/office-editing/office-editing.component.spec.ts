import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeEditingComponent } from './office-editing.component';

describe('OfficeEditingComponent', () => {
  let component: OfficeEditingComponent;
  let fixture: ComponentFixture<OfficeEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
