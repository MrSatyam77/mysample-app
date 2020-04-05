/** External import */
import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
/** Internal import */
import { UserService } from "@app/shared/services/user.service";
import { MessageService, DialogService } from '@app/shared/services';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';

@Component({
  selector: 'app-client-question-form-list',
  templateUrl: './client-question-form-list.component.html',
  styleUrls: ['./client-question-form-list.component.scss']
})
export class ClientQuestionFormListComponent implements OnInit {
  /** Public variable */
  @Input() settings: any;

  constructor(
    private userService: UserService,
    private myTaxPortalService: MyTaxportalService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private router: Router
  ) { }

  //Check for privileges
  userCan(privilege) {
    return this.userService.can(privilege);
  };

  /**
  * @author Hitesh Soni
  * Set to Selected question set
  * @memberof ClientQuestionFormListComponent
  */
  setSelectedQuestionSet(questionSet) {
    this.settings.questionSet = questionSet;
    this.saveSettings();
  }

  /**
 * @author Hitesh Soni
 * Add or edit Questionset
 * @memberof ClientQuestionFormListComponent
 */
  addEditTaxMnanager(Id) {
    if (Id) { this.router.navigateByUrl("mytaxportal/questionsset/" + Id) }
    else { this.router.navigateByUrl("/mytaxportal/questionsset/") }
  }

  /**
  * @author Hitesh Soni
  * Delete 
  * @memberof ClientQuestionFormListComponent
  */
  deleteQuestionSet(Id) {
    let dialog = this.dialogService.confirm({ title: 'Confirmation', text: "Are you sure you want to delete QuestionSet ?" }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
    dialog.result.then((result) => {
      if (result.toLowerCase() == "yes") {
        this.myTaxPortalService.deleteQuestion(Id).then(
          (data: any) => {
            let index = this.settings.questionSets.findIndex(x => x.id == Id);
            if (index != -1) {
              this.settings.questionSets.splice(index, 1);
            }
            this.messageService.showMessage('Question set deleted successfully.', 'success');
          },
          (error: any) => {
            this.messageService.showMessage('Error occurred while processing your request.', 'error');
          });
      }
    });
  }

  /**
  * @author Hitesh Soni
  * Copy 
  * @memberof ClientQuestionFormListComponent
  */
  copyTaxMnanager(Id, title) {
    this.myTaxPortalService.copyQuestionSet(Id).then(
      (data: any) => {
        this.settings.questionSets.push({ 'title': title, 'id': data });
      },
      (error) => {
        this.messageService.showMessage('Error occurred while processing your request.', 'error');
      },
    )
  }

  ngOnInit() {
  }

  /**
    * @author Hitesh Soni
    * Save Settings
    * @private
    * @param {}
    * @returns
    * @memberof ClientQuestionFormListComponent
    */
  private saveSettings() {
    return new Promise((resolve, reject) => {
      this.myTaxPortalService.saveSettings(this.settings).then((result) => {
        this.messageService.showMessage('Company Settings saved successfully.', 'success');
        resolve(result);
      }, (error) => {
        this.messageService.showMessage('Error occurred while saving the settings.', 'error');
      });
    })
  }
}
