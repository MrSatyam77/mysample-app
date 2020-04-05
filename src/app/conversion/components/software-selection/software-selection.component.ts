/** External import */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from "@angular/router";
/** Internal import */
import { ConversionDetailService } from '@app/conversion/conversion-details/conversion-detail.service';
import { UserService } from '@app/shared/services';

@Component({
  selector: 'conversion-software-selection',
  templateUrl: './software-selection.component.html',
  styleUrls: ['./software-selection.component.scss']
})
export class SoftwareSelectionComponent implements OnInit {
  /** Public variab */
  softwareNames: any;
  taxYar: string;
  slectedSoftware: any;
  showSoftwareSection: boolean;
  @Output() selectedSoftware = new EventEmitter();

  /** Cinstructor */
  constructor(
    private conversionDetailService: ConversionDetailService,
    private userService: UserService,
    private router: Router
  ) { }

  softwareSelection(name) {
    this.selectedSoftware.emit(name);
  }

  /** Show hide sofware selection */
  showSoftwareSelection() {
    this.showSoftwareSection = !this.showSoftwareSection;
  }

  /** Back to list */
  goToList() {
    this.router.navigateByUrl("/conversionnew");
  }

  /** Init */
  ngOnInit() {
    this.taxYar = this.userService.getTaxYear();
    this.softwareNames = this.conversionDetailService.getSoftwareNames(this.taxYar);
    if (this.conversionDetailService.selectedSoftware) {
      this.slectedSoftware = this.conversionDetailService.selectedSoftware;
    }
    else {
      this.slectedSoftware = "";
    }
  }
}
