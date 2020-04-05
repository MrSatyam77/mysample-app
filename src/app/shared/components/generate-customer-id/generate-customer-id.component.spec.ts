import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateCustomerIdComponent } from './generate-customer-id.component';

describe('GenerateCustomerIdComponent', () => {
  let component: GenerateCustomerIdComponent;
  let fixture: ComponentFixture<GenerateCustomerIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateCustomerIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateCustomerIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
