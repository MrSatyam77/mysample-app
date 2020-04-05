/** External Import */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";

/** Internal Import */
import { RoleService } from '@app/role/role.service';
import { MessageService } from '@app/shared/services/message.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { UserService } from '@app/shared/services/user.service';
@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {
  /** public variable */
  public role: any = { privilageList: [] };
  public categoryList = []; // category list data
  public roleForm: FormGroup; // form variable
  public id: string;
  public rowData;

  constructor(private roleService: RoleService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private userService: UserService) { }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description privilege
* @memberof roleComponent
*/
  public userCan(privilege) {
    return this.userService.can(privilege);
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description form field 
* @memberof roleComponent
*/
  private roleFormData() {
    this.roleForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      description: this.fb.control(''),
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description save and edit data
* @memberof roleComponent
*/
  public save() {
    let selectedPrivileges = [];
    this.role.privilageList.forEach(element => {
      if (element.isSelected === true) {
        selectedPrivileges.push(element.name);
      }
    });

    this.role = {
      name: this.roleForm.get('name').value,
      description: this.roleForm.get('description').value,
      privileges: selectedPrivileges
    }

    if (this.id) {
      this.role.key = this.id;
      this.roleService.updateRole({ 'role': this.role }).then((result: any) => {
        this.messageService.showMessage('Updated successfully', 'success', 'ROLEEDITCONTROLLER_CREATESUCCESS')
        this.router.navigate(["role/list"]);
      }, (error) => {
      });
    }
    else {
      this.roleService.createRole({ 'role': this.role }).then((result: any) => {
        this.messageService.showMessage('Created successfully', 'success', 'ROLEEDITCONTROLLER_CREATESUCCESS')
        this.router.navigate(["role/list"]);
      }, (error) => {
      });
    }
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description get role data
* @memberof roleComponent
*/
  public get() {
    this.roleService.getRole({ 'roleId': this.id }).then((result: any) => {
      this.rowData = result.data;
      let selected = this.rowData.privileges.map((obj) => { return obj.name });
      this.role.privilageList.forEach(element => {
        if (selected.indexOf(element.name) >= 0) {
          element.isSelected = true;
        }
      });
      this.updateCustomeRole();
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description auto fill custome role data
* @memberof roleComponent
*/
  public updateCustomeRole() {
    this.roleForm.patchValue(this.rowData);
  }

  /**
  * @author Satyam Jasoliya
  * @date 04th Nev 2019
  * @description remove role 
  * @memberof roleComponent
  */
  public remove() {
    if (this.id) {
      this.dialogService.confirm({ text: 'This role may assigned to any user. Please check before deleting it.', title: 'Confirmation' }, { 'keyboard': false, 'backdrop': false, 'size': 'mf', 'windowClass': 'my-class' }).result.then((responseIfYes) => {
        this.roleService.removeRoles({ 'roleIds': [this.id] }).then((response) => {
          this.messageService.showMessage('Remove successfully', 'success', 'ROLELISTCONTROLLER_REMOVESUCCESS');
          this.router.navigate(["role/list"]);
        })
      }, (error) => {
      });
    }
  }
  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description redirect role page
* @memberof roleComponent
*/
  public cancel() {
    this.router.navigate(["role/list"]);
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description get available privilage list 
* @memberof roleComponent
*/
  private getAvailablePrivilageList() {
    this.roleService.getAvailablePrivilage().then((result: any) => {
      this.role.privilageList = result.data;
      this.categoryList = this.role.privilageList.map(t => t.category).filter((item, i, arr) => arr.indexOf(item) === i);
      if (this.id) {
        this.get();
      }
    });
  }


  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.roleFormData();
    this.getAvailablePrivilageList();
  }
}
