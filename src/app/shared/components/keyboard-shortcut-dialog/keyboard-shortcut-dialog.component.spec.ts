import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardShortcutDialogComponent } from './keyboard-shortcut-dialog.component';

describe('KeyboardShortcutDialogComponent', () => {
  let component: KeyboardShortcutDialogComponent;
  let fixture: ComponentFixture<KeyboardShortcutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyboardShortcutDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardShortcutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
