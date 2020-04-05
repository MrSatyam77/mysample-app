import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-question-set',
  templateUrl: './select-question-set.component.html',
  styleUrls: ['./select-question-set.component.scss']
})
export class SelectQuestionSetComponent implements OnInit {

  public data: any

  constructor(private activeModal: NgbActiveModal) { }

  public close() {
    this.activeModal.close();
  }

  public saveManager() {
    this.activeModal.close(this.data);
  }

  ngOnInit() {
  }

}
