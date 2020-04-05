import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesConflictsComponent } from './files-conflicts.component';

describe('FilesConflictsComponent', () => {
  let component: FilesConflictsComponent;
  let fixture: ComponentFixture<FilesConflictsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesConflictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesConflictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
