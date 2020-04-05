import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K1ImportComponent } from './k1-import.component';

describe('K1ImportComponent', () => {
  let component: K1ImportComponent;
  let fixture: ComponentFixture<K1ImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K1ImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K1ImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
