import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaCheckComponent } from './proforma-check.component';

describe('ProformaCheckComponent', () => {
  let component: ProformaCheckComponent;
  let fixture: ComponentFixture<ProformaCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProformaCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
