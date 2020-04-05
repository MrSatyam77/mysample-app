//External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal imports
import { OfficeService } from '@app/office/office.service';
import { MessageService } from '@app/shared/services';

@Component({
  selector: 'app-verification-questions',
  templateUrl: './verification-questions.component.html',
  styleUrls: ['./verification-questions.component.scss']
})

export class VerificationQuestionsComponent implements OnInit {
  public isDataLoading = true;
  // to store response data to pass in another api call as request data
  public isQuestionAnswersVerified: boolean = false;
  public allQuestions = [];
  public AtteptAnswer = []
  public numberofAttept: number = 0;
  public noOfQuestion: number = 3;
  public data: any;
  public questionsAnswersList: any;

  constructor(private _officeService: OfficeService, private _ngbActiveModal: NgbActiveModal, private _messageService: MessageService) { }

  ngOnInit() {
    const self = this;
    self.isDataLoading = true;
    self._officeService.getQuestionsAnswersList(self.data.objectToGetEVSQuestionList).then((res: any) => {
      if (res && res.code == 2009) {
        self.close('EfinRequired');
      } else {
        if (res.data && res.data.data) {
          self.data.response = res.data.data;
          self.allQuestions = JSON.parse(JSON.stringify(res.data.data.questions));
          self.questionsAnswersList = self.allQuestions.slice(0, this.noOfQuestion);
        }
      }
      self.isDataLoading = false;
    }, (error) => {
      self.isDataLoading = false;
    })
  }

  /**
   * 
   * @param closeData 
   */
  public close(closeData?: any) {
    this._ngbActiveModal.close(closeData);
  };

  /**
   * to verify questions answers
   */
  public verificationQuestionAnswers() {
    this.isDataLoading = true;
    let nextAttemptPossible;
    let count = this.questionsAnswersList.length;
    if (this.numberofAttept == 0) {
      if (this.allQuestions.length > this.noOfQuestion) {
        nextAttemptPossible = true
      } else {
        nextAttemptPossible = undefined;
      }
    }
    const self = this;
    self._officeService.verificationQuestionAnswers(self.questionsAnswersList, self.data.response.id, count, nextAttemptPossible,this.data.userInfo.efin).then((response: any) => {
      self.isDataLoading = false;
      if (response.correctAnswerCount === self.questionsAnswersList.length) {
        self.isQuestionAnswersVerified = true;
      } else if (nextAttemptPossible == true && response.correctAnswerCount === self.questionsAnswersList.length - 1) {
        self._nextAtteptForAnswer();
      } else {
        self.isQuestionAnswersVerified = false;
        self._messageService.showMessage('Fail to verify your identity.', 'info');
        self.close(self.isQuestionAnswersVerified);
      }
    }, (error) => {
      self.isDataLoading = false;
    });
  }

  /**
   * 
   */
  public _nextAtteptForAnswer() {
    if (this.numberofAttept == 0) {
      this.AtteptAnswer = [];
      this.numberofAttept = 1;
      if (this.allQuestions && this.allQuestions.length > this.noOfQuestion) {
        this.questionsAnswersList = this.allQuestions.slice(this.noOfQuestion, this.noOfQuestion + 3);
      } else {
        this.isQuestionAnswersVerified = false;
        this._messageService.showMessage('Fail to verify your identity.', 'info');
        this.close(this.isQuestionAnswersVerified);
      }
    }
  }

  /**
   * 
   * @param id 
   */
  public setCountOfAttendedQuestions(id) {
    if (this.AtteptAnswer.indexOf(id) == -1) {
      this.AtteptAnswer.push(id)
    }
  }
}
