//External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal Imports
import { UserService } from '@app/shared/services/user.service'

@Component({
	selector: 'app-custom-return-status',
	templateUrl: './custom-return-status.component.html',
	styleUrls: ['./custom-return-status.component.scss']
})
export class CustomReturnStatusComponent implements OnInit {

	constructor(private userService: UserService,
		private activeModal: NgbActiveModal, ) { }

	public isError: boolean = false;
	public isProcessing: boolean = false;
	public customReturnStatus: any = {};
	public newTitle: string = "";
	
	/**
	 * @author shreya kanani
	 * @description this method add new status
	 */
	public addStatus() {
		if ((this.newTitle) && this.newTitle != "") {
			this.customReturnStatus.push({ title: this.newTitle, isNew: true });
			this.newTitle = "";
		}
	}

	/**
	 * @author shreya kanani
	 * @description this method save custom return status 
	 */
	public saveCustomReturnStatus() {
		let newStatus = [], changedStatus = [], deletedStatus = [];
		//Prepare all status in three category  
		this.customReturnStatus.forEach(status => {
			if (status.isNew) {
				newStatus.push(status);
				delete status.isNew;
			} else if (status.isChanged) {
				changedStatus.push(status);
				delete status.isChanged;
			} else if (status.isDeleted) {
				deletedStatus.push(status);
				delete status.isDeleted;
			}
			delete status.isPredefined;
		})
		//If any array will have value then only we will make API call else we will close modal.
		if (newStatus.length > 0 || changedStatus.length > 0 || deletedStatus.length > 0) {
			this.isProcessing = true;
			this.userService.saveCustomReturnStatus({ newStatus: newStatus, deletedStatus: deletedStatus, changedStatus: changedStatus }).then(() => {
				this.isProcessing = false;
				this.activeModal.close(false);

			}, () => {
				this.isProcessing = false;
				this.isError = true;
			});
		} else {
			this.activeModal.close(false);
		}
	}

	/**
	 * @author shreya kanani
	 * @description this method check whether status is deleted or not 
	 */
	public isStatusDelete() :boolean {
		let isDeleted = this.customReturnStatus.filter(function(obj) {
			return obj.isDeleted === true;
		})
		if (isDeleted && isDeleted.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * @author shreya kanani
	 * @description close the dialog
	 */
	public close() {
		this.activeModal.close(false);
	}

	ngOnInit() {
		this.customReturnStatus = this.userService.getCustomReturnStatusList();
	}

}
