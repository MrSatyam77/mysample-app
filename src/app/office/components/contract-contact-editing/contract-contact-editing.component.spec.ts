import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractContactEditingComponent } from './contract-contact-editing.component';

describe('ContractContactEditingComponent', () => {
  let component: ContractContactEditingComponent;
  let fixture: ComponentFixture<ContractContactEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractContactEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractContactEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
