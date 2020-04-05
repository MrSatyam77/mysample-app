import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EfinEditingComponent } from './efin-editing.component';

describe('EfinEditingComponent', () => {
  let component: EfinEditingComponent;
  let fixture: ComponentFixture<EfinEditingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfinEditingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfinEditingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
