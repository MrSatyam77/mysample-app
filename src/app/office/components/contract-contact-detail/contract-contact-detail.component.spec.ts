import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractContactDetailComponent } from './contract-contact-detail.component';

describe('ContractContactDetailComponent', () => {
  let component: ContractContactDetailComponent;
  let fixture: ComponentFixture<ContractContactDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractContactDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractContactDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
