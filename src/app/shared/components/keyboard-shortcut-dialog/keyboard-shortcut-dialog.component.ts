// External imports
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
// Internal imports
import { BrowserService } from '@app/shared/services/browser.service';
@Component({
  selector: 'app-keyboard-shortcut-dialog',
  templateUrl: './keyboard-shortcut-dialog.component.html',
  styleUrls: ['./keyboard-shortcut-dialog.component.scss']
})
export class KeyboardShortcutDialogComponent implements OnInit {
  public location: any;
  public os: any;
  public printData: any = [];
  constructor(private pdfWrapper: PdfMakeWrapper, private browserService: BrowserService, private Location: Location,
    private _activeModal: NgbActiveModal) { }

  //  Close dialog
  close(): void {
    this._activeModal.close(false);
  }
  /**
   * @author Om kanada
   * @description
   * function use to print pdf file of the input data.
   */

  printPdf(): void {
    const temp = [];
    const body = [];
    // let printData;
    this.printData.forEach(obj => {
      const keys = Object.keys(obj) // get all selected keys
      const temp = [];
      keys.forEach(key => {
        if (key === 'header' && obj[key] !== '') {
          temp.push({ text: obj[key], style: 'tableHeader' });
        } else if ((key === 'description' || key === 'shortcut') && obj[key] == '') {
          temp.push({ text: obj[key], style: 'tableHeader' });
        } else {
          temp.push(obj[key]);
        }
      });
      body.push(temp);
    });
    const content = []; // to hold enitire content of pdf
    content.push({ table: { widths: [100, 250, 150], body: body }, layout: 'lightHorizontalLines' });
    this.pdfWrapper.pageSize('A4');
    this.pdfWrapper.footer((currentPage, pageCount) => {
      return currentPage.toString() + ' of ' + pageCount;
    });
    this.pdfWrapper.pageMargins([30, 40, 20, 40]);
    this.pdfWrapper.styles({
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
        fillColor: '#eaeaea'
      }
    });
    this.pdfWrapper.defaultStyle({ fontSize: 12 });
    const iOS = (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
    if (iOS === true) {
      this.pdfWrapper.add(body);
      this.pdfWrapper.create().open();
    } else {
      this.pdfWrapper.add(content);
      this.pdfWrapper.create().download('KeyBoardShortcutList' + '.pdf');
      // this.pdfWrapper.create(docDefinition).download("KeyBoardShortcutList" + ".pdf");
    }
  }

  dialogData(): void {
    this.os = this.browserService.getSystemInformation('os');
    const path = this.Location.path();
    if (path.includes('home')) {
      this.printData = [{ header: 'Recent Returns', description: '', shortcut: '' },
      { header: '', description: 'New Return', shortcut: 'Ctrl+R' },
      { header: '', description: 'Return List', shortcut: 'Ctrl+L' }
      ];
      this.location = 'home';
    } else if (path.includes('return/edit')) {
      this.printData = [{ header: 'Fields', description: '', shortcut: '' },
      { header: '', description: 'Override', shortcut: 'F8' },
      { header: '', description: 'Remove Override', shortcut: 'Shift+F8' },
      { header: '', description: 'Estimated', shortcut: 'F3' },
      { header: '', description: 'Remove Estimated', shortcut: 'Shift+F3' },
      { header: '', description: 'Calculator', shortcut: 'F4' },
      { header: 'Forms', description: '', shortcut: '' },
      { header: '', description: 'Open Add Form Menu', shortcut: 'Ctrl+F10' },
      { header: '', description: 'Open Quick Forms List', shortcut: 'Alt+Q' },
      { header: '', description: 'Add New Instance Of Current Form (Ex: W2)', shortcut: 'Shift+F10' },
      { header: '', description: 'Remove/Delete Current Form', shortcut: 'Shift+F9' },
      { header: '', description: 'Go To Previous Form (Stack Navigation)', shortcut: 'Alt+Page Up' },
      { header: '', description: 'Go To Next Form (Stack Navigation)', shortcut: '  Alt+Page Down' },
      { header: 'Return', description: '', shortcut: '' },
      { header: '', description: 'Save', shortcut: 'F2' },
      { header: '', description: 'Close', shortcut: 'F10' },
      { header: '', description: 'Open Return Status List', shortcut: 'F7' },
      { header: '', description: 'Open Print Menu', shortcut: 'Alt+P' },
      { header: '', description: 'Print Return', shortcut: 'Ctrl+P' },
      { header: '', description: 'Open E-File Menu', shortcut: 'Alt+E' },
      { header: '', description: 'Transmit Return', shortcut: 'Ctrl+E' },
      { header: '', description: 'Open Rejection', shortcut: 'Ctrl+R' },
      { header: '', description: 'Open Tools Menu', shortcut: 'Alt+T' },
      { header: '', description: 'Switch To Interview Mode', shortcut: 'Alt+I' },
      { header: '', description: 'Perform Review', shortcut: 'Ctrl+D' },
      { header: 'State', description: '', shortcut: '' },
      { header: '', description: 'Open Add State Menu', shortcut: 'Alt+S' },
      { header: 'Others', description: '', shortcut: '' },
      { header: '', description: 'Toggle Left Panel', shortcut: 'Alt+L' },
      { header: '', description: 'Toggle Right Panel', shortcut: 'Alt+R' },
      { header: 'Calculator', description: '', shortcut: '' },
      { header: '', description: 'Capture Value From TaxField', shortcut: 'F11' },
      { header: '', description: 'Insert Value Into TaxField', shortcut: 'Insert' },
      { header: '', description: 'Clear Current Entry', shortcut: 'Delete' },
      { header: '', description: 'Clear All', shortcut: 'Ctrl+Delete' },
      { header: '', description: 'Clear Memory', shortcut: 'Ctrl+L' },
      { header: '', description: 'Recall Memory', shortcut: 'Ctrl+R' },
      { header: '', description: 'Store in Memory', shortcut: 'Ctrl+M' },
      { header: '', description: 'Add to Memory', shortcut: 'Ctrl+A' },
      { header: '', description: 'Substract from Memory', shortcut: 'Ctrl+S' },
      { header: '', description: 'Remove Single Value', shortcut: 'Backspace' },
      ];
      this.location = 'return';
    } else if (path.includes('return/interview')) {
      this.printData = [{ header: 'Fields', description: '', shortcut: '' },
      { header: '', description: 'Override', shortcut: 'F8' },
      { header: '', description: 'Remove Override', shortcut: 'Shift+F8' },
      { header: '', description: 'Estimated', shortcut: 'F3' },
      { header: '', description: 'Remove Estimated', shortcut: 'Shift+F3' },
      { header: '', description: 'Calculator', shortcut: 'F4' },
      { header: 'Forms', description: '', shortcut: '' },
      { header: '', description: 'Previous Form', shortcut: 'Alt+Page Up' },
      { header: '', description: 'Next Form', shortcut: '  Alt+Page Down' },
      { header: 'Return', description: '', shortcut: '' },
      { header: '', description: 'Save', shortcut: 'F2' },
      { header: '', description: 'Close', shortcut: 'F10' },
      { header: '', description: 'Print Return', shortcut: 'Ctrl+P' },
      { header: '', description: 'Transmit Return', shortcut: 'Ctrl+S' },
      { header: '', description: 'Switch To Form Mode', shortcut: 'Alt+F' },
      { header: '', description: 'Perform Review', shortcut: 'Ctrl+D' },
      { header: 'State', description: '', shortcut: '' },
      { header: '', description: 'Add State', shortcut: 'Alt+S' },
      { header: 'Others', description: '', shortcut: '' },
      { header: '', description: 'Toggle Right Panel', shortcut: 'Alt+R' },
      { header: 'Calculator', description: '', shortcut: '' },
      { header: '', description: 'Capture Value From TaxField', shortcut: 'F11' },
      { header: '', description: 'Insert Value Into TaxField', shortcut: 'Insert' },
      { header: '', description: 'Clear Current Entry', shortcut: 'Delete' },
      { header: '', description: 'Clear All', shortcut: 'Ctrl+Delete' },
      { header: '', description: 'Clear Memory', shortcut: 'Ctrl+L' },
      { header: '', description: 'Recall Memory', shortcut: 'Ctrl+R' },
      { header: '', description: 'Store in Memory', shortcut: 'Ctrl+M' },
      { header: '', description: 'Add to Memory', shortcut: 'Ctrl+A' },
      { header: '', description: 'Substract from Memory', shortcut: 'Ctrl+S' },
      { header: '', description: 'Remove Single Value', shortcut: 'Backspace' },
      ];
      this.location = 'interview';
    }

  }

  ngOnInit() {
    this.dialogData();
  }
}
