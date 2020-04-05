import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { IColorPallete, IWidgetSize, IRowColorPallete } from '@app/dashboard/dashboard.model';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit {

  @Input() widgetName: string = '';
  @Input() settings: any = {};
  @Output('save') saveSettings: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeSettings: EventEmitter<any> = new EventEmitter<any>();
  @Output('cancel') cancelSettings: EventEmitter<any> = new EventEmitter<any>();
  private isSaved: boolean = false;
  public widgetSizes: IWidgetSize[] = [];
  public whiteColorPallete: IRowColorPallete;
  public blackColorPallete: IRowColorPallete;

  constructor(private dashboardService: DashboardService) {
    this.widgetSizes = this.dashboardService.widgetRatioSize;
    this.whiteColorPallete = this.dashboardService.whiteColorPallete;
    this.blackColorPallete = this.dashboardService.blackColorPallete;
  }

  changeBackgroundColor(backgroundColor: string, colorCode: string, luminance: any) {
    this.settings.backgroundColor = backgroundColor;
    this.settings.rowColor = this.colorLuminance(backgroundColor, luminance);
    this.changeSettings.emit({ name: this.widgetName, backgroundColor: backgroundColor, colorCode: colorCode, rowColor: this.colorLuminance(backgroundColor) })
  }

  changeSize(id, size, columns, count) {
    this.settings.id = id;
    this.settings.width = size.width;
    this.settings.height = size.height;
    this.settings.columnNumber = columns;
    this.settings.count = count;
  }

  emitSaveSettings() {
    this.isSaved = true;
    this.saveSettings.emit({ name: this.widgetName, settings: this.settings });
  }

  emitCancelSettings() {
    this.cancelSettings.emit(this.widgetName);
  }

  trackByFn(index, item) {
    return index;
  }

  public colorLuminance(col, amt = 20) {
    var usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }
    var g = (num & 0x0000FF) + amt;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (!this.isSaved) {
      this.cancelSettings.emit(this.widgetName);
    }
  }
}
