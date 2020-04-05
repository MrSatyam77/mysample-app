/** External import */
import { Component, OnInit, Directive, Input, TemplateRef, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
/** Internal import */
import { IQuestionsSet } from '@app/my-taxportal/settings';
import { UserService, DialogService } from '@app/shared/services';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';

@Component({
  selector: 'app-clientquestionform',
  templateUrl: './clientquestionform.component.html',
  styleUrls: ['./clientquestionform.component.scss']
})
export class ClientquestionformComponent implements OnInit {
  /** Public variable */
  questionSetId: string;
  questionsData: IQuestionsSet = {};
  showAnswerYesOrNo = [{ "id": "Yes", "displayText": "Yes is selected" }, { "id": "No", "displayText": "No is selected" }, { "displayText": "Both" }];
  isSaveDisabled: boolean = true;
  permission: any;
  /** Private field */
  private showAnswerType: any = [{ "id": "Yes/No", "displayText": "Yes/No" }, { "id": "Free Text", "displayText": "Free Text" }, { "id": "Document", "displayText": "Document" }];

  constructor(
    private mytaxportalService: MyTaxportalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  /** show required control */
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
      this.isSaveDisabled = false;
      answerType.forEach(element => {
        //Show Mandatory to Answer check box list
        element.showIsRequired = true;
      });
      this.questionsData.questions[index].showIsRequired = true;
    } else {
      this.isSaveDisabled = true;
      this.questionsData.questions[index].showIsRequired = false;
    }
    this.showFreeTextOrDocument(answerType, null, index);
  }

  /** To show free text or document */
  showFreeTextOrDocument(answerType, controlType, index) {
    let yesNo = answerType.find(function (obj) { return obj.id == "Yes/No" });
    if (controlType) {
      if (yesNo && yesNo.isSelected == true) {
        yesNo.isRequired = true;
        let ansIndex = answerType.findIndex(function (obj) { return obj.id == controlType });
        if (ansIndex != -1) {
          this.updateFlag(answerType, controlType, ansIndex, index);
        }
      }
      else {
        answerType.forEach(element => {
          element.showDocument = false;
          element.showFreeText = false;
        });
      }
    }
    else {
      if (yesNo && yesNo.isSelected == true) {
        yesNo.isRequired = true;
        answerType.forEach((element, ansIndex) => {
          this.updateFlag(answerType, element.id, ansIndex, index);
        });
      }
      else {
        this.questionsData.questions[index].showFreeText = false;
        this.questionsData.questions[index].showDocument = false;
        answerType.forEach(element => {
          element.showDocument = false;
          element.showFreeText = false;
        });
      }
    }
  }

  updateFlag(answerType, controlType, index, qnsIndex) {
    if (answerType[index] && answerType[index].isSelected == true && answerType[index].isRequired == true) {
      if (controlType.toLowerCase() == "free text") {
        answerType[index].showFreeText = true;
        this.questionsData.questions[qnsIndex].showFreeText = true;
      }
      else if (controlType.toLowerCase() == "document") {
        answerType[index].showDocument = true;
        this.questionsData.questions[qnsIndex].showDocument = true;
      }
    }
    else {
      if (controlType.toLowerCase() == "free text") {
        answerType[index].showFreeText = false;
        this.questionsData.questions[qnsIndex].showFreeText = false;
      }
      else if (controlType.toLowerCase() == "document") {
        answerType[index].showDocument = false;
        this.questionsData.questions[qnsIndex].showDocument = false;
      }
    }
  }

  /** Remove Question */
  removeQuestion(index) {
    let dialog = this.dialogService.confirm({ title: 'Confirmation', text: "Are you sure you want to delete Question ?" }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
    dialog.result.then((result) => {
      if (result.toLowerCase() == "yes") {
        this.questionsData.questions.splice(index, 1);
      }
    });
  }

  /** Add new question */
  addQuestion() {
    this.addQuestionsData();
  }

  /** Save */
  save() {
    this.questionsData.id = this.questionSetId;
    this.questionsData.questions.forEach((element) => {
      element.answerType.forEach(ansType => {
        delete ansType.showDocument;
        delete ansType.showFreeText;
        delete ansType.showIsRequired;
      });
    });
    this.mytaxportalService.assignId(this.questionsData, true);

    this.mytaxportalService.save(this.questionsData).then((data: any) => {
      this.router.navigateByUrl("mytaxportal/settings");
    });
  }

  /** Cancel */
  cancel() {
    this.router.navigateByUrl("mytaxportal/settings");
  }



  /** init */
  ngOnInit() {
    if (this.mytaxportalService.canClientPortalAccess() == true) {
      this.userCan();
      this.questionsData.questions = [];
      this.questionSetId = this.activatedRoute.snapshot.params["Id"];
      if (this.questionSetId) {
        this.getQuestionSet();
      }
      else {
        this.addQuestionsData();
      }
    }
    else {
      this.router.navigateByUrl("/home");
    }
  }


  /** Check privileges */
  private userCan() {
    this.permission = { canSaveClient: this.userService.can("CAN_SAVE_CLIENT") };
  };

  /** Set default data */
  private addQuestionsData() {
    this.questionsData.questions.push({
      "questionText": "",
      "questionType": "",
      "isDocNeeded": false,
      "sequence": null,
      "answerType": JSON.parse(JSON.stringify(this.showAnswerType))
    });
    this.mytaxportalService.assignId(this.questionsData, false);
  }

  /** Get Question set data by id */
  private getQuestionSet() {
    this.mytaxportalService.getQuestionSet(this.questionSetId).then(
      (data: any) => {
        this.questionsData = data;
        this.isSaveDisabled = false;
        this.setMandatoryOptions();
      },
      (error) => { }
    );
  }

  /** Set Mandatory options */
  private setMandatoryOptions() {
    this.questionsData.questions.forEach((item, index) => {
      item.answerType.forEach(ansType => {
        this.showIsRequired(item.answerType, index);
        this.showFreeTextOrDocument(item.answerType, ansType.id, index);
      });
    });
  }

  public mandatorySectionHandle(answerType: any, question: any, index: any) {
    if (answerType.isSelected) {
      answerType.isRequired = !answerType.isRequired;
      this.showFreeTextOrDocument(question.answerType, answerType.id, index)
    }
  }


  public get isFormValid(): boolean {
    for (var index in this.questionsData.questions) {
      var isAnySelected = false;
      for (var innerIndex in this.questionsData.questions[index].answerType) {
        if (this.questionsData.questions[index].answerType[innerIndex].isSelected) {
          isAnySelected = true;
        }
      }
      if (!isAnySelected) {
        return isAnySelected;
      }
    }
    return isAnySelected;
  }
}

