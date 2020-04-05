import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from '@app/shared/services';
import { SelectQuestionSetComponent } from '@app/my-taxportal/dialogs/select-question-set/select-question-set.component';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';
import { ClientQuestionOutlineComponent } from '@app/my-taxportal/dialogs/client-question-outline/client-question-outline.component';

@Component({
  selector: 'app-invite-client-question-section',
  templateUrl: './invite-client-question-section.component.html',
  styleUrls: ['./invite-client-question-section.component.scss']
})
export class InviteClientQuestionSectionComponent implements OnInit {

  @Input() settings: any = {};
  public switchingQuestionSet: boolean = false;

  constructor(private dialogService: DialogService, private myTaxportalService: MyTaxportalService) { }

  /**
   * @author Ravi Shah
   * Change the Question Set and get the updated question Set
   * @memberof InviteClientQuestionSectionComponent
   */
  public changeQuestionSet() {
    this.dialogService.custom(SelectQuestionSetComponent, this.settings, { 'keyboard': false, 'backdrop': false, 'size': 'md' }).result.then((response) => {
      if (response) {
        this.switchingQuestionSet = true;
        this.myTaxportalService.getQuestionSet(response.selectedQuestionSet).then((result) => {
          if (response.questionSets && response.questionSets.length > 0) {
            let questionSetExists = response.questionSets.findIndex((obj) => {
              return obj.id === response.selectedQuestionSet;
            });
            if (questionSetExists !== -1) {
              this.settings.questionTitle = response.questionSets[questionSetExists].title;
              this.settings.selectedQuestionSet = response.selectedQuestionSet;
              this.settings.changedQuestionSet = result;
            }
          } else {
            this.settings.questionTitle = undefined;
          }
          this.switchingQuestionSet = false;
        }, error => {
          this.switchingQuestionSet = false;
        });
      }
    });
  }

  /**
   * @author Ravi Shah
   * Mange question and answer for question set
   * @memberof InviteClientQuestionSectionComponent
   */
  public manageClientQuestion() {
    let _self = this;
    let dialog = this.dialogService.custom(ClientQuestionOutlineComponent, { type: "inviteClient", data: this.settings.changedQuestionSet }, { 'keyboard': false, 'backdrop': false, 'size': 'xl', 'windowClass': 'my-class' });
    dialog.result.then(function (response) {
      if (response) {
        _self.settings.changedQuestionSet = response;
      }
    });
  }

  ngOnInit() {
  }
}
