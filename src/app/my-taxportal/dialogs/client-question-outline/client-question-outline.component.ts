/** External Import */
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';
import { UserService, MessageService, DialogService } from '@app/shared/services';
import { AnswerHistoryComponent } from '../answer-history/answer-history.component';
/** Internal import */

@Component({
  selector: 'app-client-question-outline',
  templateUrl: './client-question-outline.component.html',
  styleUrls: ['./client-question-outline.component.scss']
})
export class ClientQuestionOutlineComponent implements OnInit {
  /** Public variable */
  data: any;
  ratio: string;
  questionData: any;
  permission: any;
  showAnswerYesOrNo: any;
  constructor(
    private activeModal: NgbActiveModal,
    private myTaxportalService: MyTaxportalService,
    private userService: UserService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  /**
  * @author Hitesh Soni
  * Close the Dialog
  * @memberof ClientQuestionOutlineComponent
  */
  public close(data) {
    this.activeModal.close(data);
  }

  /**
  * @author Hitesh Soni
  * Show answer history
  * @memberof ClientQuestionOutlineComponent
  */
  historyQuestion(data) {
    this.dialogService.custom(AnswerHistoryComponent, data, { 'keyboard': false, 'backdrop': false, 'size': 'xl' }).result.then(() => { });
  }

  /**
  * @author Hitesh Soni
  * Remove question
  * @memberof ClientQuestionOutlineComponent
  */
  removeQuestion(index) {
    let dialog = this.dialogService.confirm({ title: 'Confirmation', text: "Are you sure you want to delete Question ?" }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
    dialog.result.then((result) => {
      if (result.toLowerCase() == "yes") {
        this.questionData.questions.splice(index, 1);
      }
    });
  }

  /**
 * @author Hitesh Soni
 * Add new question
 * @memberof ClientQuestionOutlineComponent
 */
  addQuestion() {
    this.questionData.questions.push({
      "questionText": "",
      "questionType": "",
      "isDocNeeded": false,
      "sequence": null,
      "answerType": JSON.parse(JSON.stringify(this.myTaxportalService.getAnswerType())),
      "answer": {}
    })
    this.myTaxportalService.assignId(this.questionData);
  }

  /**
  * @author Hitesh Soni
  * Set required options
  * @memberof ClientQuestionOutlineComponent
  */
  showIsRequired(answerType, index) {
    let count = 0;
    answerType.forEach(element => {
      if (element.isSelected) {
        count++;
      }
      if (element.id === 'Yes/No' && element.isSelected === true) {
        element.isRequired = true;
      } else if (element.id === 'Yes/No' && element.isSelected === false) {
        element.isRequired = false;
      }
      if (element.id === 'Free Text' && element.isSelected === false) {
        element.isRequired = false;
      }
      if (element.id === 'Document' && element.isSelected === false) {
        element.isRequired = false;
      }
    });

    if (count > 0) {
      // this.isSaveDisabled = false;
      answerType.forEach(element => {
        //Show Mandatory to Answer check box list
        element.showIsRequired = true;
      });
      this.questionData.questions[index].showIsRequired = true;
    } else {
      //this.isSaveDisabled = true;
      this.questionData.questions[index].showIsRequired = false;
    }
    this.showFreeTextOrDocument(answerType, null, index);
  }

  showFreeTextOrDocument(answerType, controlType, index) {
    let yesNo = answerType.find(function (obj) { return obj.id == "Yes/No" });
    if (controlType) {
      if (yesNo && yesNo.isSelected == true) {
        yesNo.isRequired = true;
        let ansIndex = answerType.findIndex(function (obj) { return obj.id == controlType });
        if (ansIndex != -1) {
          this.updateFlag(answerType, controlType, ansIndex, index);
        }
      } else {
        answerType.forEach(element => {
          element.showDocument = false;
          element.showFreeText = false;
        });
      }
    } else {
      if (yesNo && yesNo.isSelected == true) {
        yesNo.isRequired = true;
        answerType.forEach((element, ansIndex) => {
          this.updateFlag(answerType, element.id, ansIndex, index);
        });
      } else {
        this.questionData.questions[index].showFreeText = false;
        this.questionData.questions[index].showDocument = false;
        answerType.forEach(element => {
          element.showDocument = false;
          element.showFreeText = false;
        });
      }
    }
  }


  /** Update Question */
  save() {
    this.myTaxportalService.assignId(this.questionData, true);
    let requestData = { id: "", answers: "", clientId: "", title: "" };
    if (this.data.questionDocId && this.data.questionDocId.indexOf('CP-QUESTIONS_') != -1) {
      if (this.questionData.questions) {
        requestData.answers = JSON.parse(JSON.stringify(this.questionData.questions));
      }
      requestData.id = this.data.questionDocId;
      requestData.clientId = this.data.clientId;
      requestData.title = this.questionData.title;

      this.myTaxportalService.updateQuestion(requestData).then((response) => {
        this.messageService.showMessage('Questions saved successfully.', 'success');
        this.close(this.questionData);
      }, (error) => {
        console.log(error)
      });
    }
    else {
      this.close(this.questionData);
    }
  }

  /** Download uploaded document */
  download(docId) {
    this.myTaxportalService.downloadDocument(docId).then((response: any) => {
      if (response) {
        let blob = this.myTaxportalService.b64toBlob(response.base64Data, response.contentType);
        let dlink = document.createElement('a');
        dlink.download = response.fileName;
        dlink.href = URL.createObjectURL(blob);
        dlink.onclick = function (e) {
          // revokeObjectURL needs a delay to work properly
          let that = this;
          setTimeout(function () {
            window.URL.revokeObjectURL(that['href']);
          }, 1000);
        };
        dlink.click();
        dlink.remove();
      }
    });
  }

  /** Download return pdf */
  downloadPdf(pdfLink, fileName) {
    this.myTaxportalService.downloadReturnDocument(pdfLink).then(function (response: any) {
      if (response) {
        let a = document.createElement('a');
        let byteArray = new Uint8Array(response.data.data);
        let file = new Blob([byteArray], { type: 'application/pdf' });
        let fileURL = window.URL.createObjectURL(file);
        a.href = fileURL;
        a.download = fileName;
        a.click();
      }
    }, function (error) {
      console.error(error);
    })
  }

  /** Init */
  ngOnInit() {
    if (this.data.type == "inviteClient") {
      this.questionData = this.data.data;
      this.setOptionsForInviteClientData();
      this.calculateRatio();
    }
    else {
      this.getQuestionSet();
    }
    this.permission = { canSaveClientQue: this.userService.can("CAN_SAVE_CLIENT_QUE") };
    this.showAnswerYesOrNo = this.myTaxportalService.getShowAnswer();
  }

  /**
  * @author Hitesh Soni
  * Get Question set
  * @memberof ClientQuestionOutlineComponent
  */
  private getQuestionSet() {
    this.myTaxportalService.getQuestionSet(this.data.questionDocId).then((data: any) => {
      this.questionData = data;
      this.questionData.answeredQuestions = this.data.answeredQuestions;
      this.questionData.totalQuestions = this.data.totalQuestions;
      this.calculateRatio();
    });
  }

  public get isFormValid(): boolean {
    for (var index in this.questionData.questions) {
      var isAnySelected = false;
      for (var innerIndex in this.questionData.questions[index].answerType) {
        if (this.questionData.questions[index].answerType[innerIndex].isSelected) {
          isAnySelected = true;
        }
      }
      if (!isAnySelected) {
        return isAnySelected;
      }
    }
    return isAnySelected;
  }

  public mandatorySectionHandle(answerType: any, question: any, index: any) {
    if (answerType.isSelected) {
      answerType.isRequired = !answerType.isRequired;
      this.showFreeTextOrDocument(question.answerType, answerType.id, index)
    }
  }

  /**
  * @author Hitesh Soni
  * Calculate ratio
  * @memberof ClientQuestionOutlineComponent
  */
  private calculateRatio() {
    this.ratio = this.questionData.answeredQuestions ? (Number((this.questionData.answeredQuestions * 100) / this.questionData.totalQuestions)).toFixed(0) : '';
  }

  private updateFlag(answerType, controlType, index, qnsIndex) {
    if (answerType[index] && answerType[index].isSelected == true && answerType[index].isRequired == true) {
      if (controlType.toLowerCase() == "free text") {
        answerType[index].showFreeText = true;
        this.questionData.questions[qnsIndex].showFreeText = true;
      }
      else if (controlType.toLowerCase() == "document") {
        answerType[index].showDocument = true;
        this.questionData.questions[qnsIndex].showDocument = true;
      }
    }
    else {
      if (controlType.toLowerCase() == "free text") {
        answerType[index].showFreeText = false;
        this.questionData.questions[qnsIndex].showFreeText = false;
      }
      else if (controlType.toLowerCase() == "document") {
        answerType[index].showDocument = false;
        this.questionData.questions[qnsIndex].showDocument = false;
      }
    }
  }

  /**
  * @author Hitesh Soni
  * Set option and prepare data for Questions
  * @memberof ClientQuestionOutlineComponent
  */
  private setOptionsForInviteClientData() {
    this.questionData.questions.forEach((element, index) => {
      element.mode = 'preview';
      element.answer = {};
      this.showIsRequired(element.answerType, index);
    });
  }
}
