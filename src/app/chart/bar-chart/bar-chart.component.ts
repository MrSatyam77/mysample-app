/** External import */
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
/** Internal import */
import { ChartCommanService } from "@app/chart/chart.service";
import { IBarChart, ISettings, DEFAULT_VALUE } from './barchart';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements OnInit {
  /** Public variable */
  IsNoDataFound: boolean;
  @Input("options") public chartOptions: IBarChart;
  @ViewChild("chartContainer", { static: true }) public chartContainer: ElementRef;
  /** Default Settings */
  public settings: ISettings = {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: DEFAULT_VALUE.PADDING_TOP as number,
    paddingBottom: 0
  };


  constructor(
    private _render: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _chartService: ChartCommanService
  ) { }

  /** Public Method */
  /**
   * @author Hitesh Soni
   * @description Redraw event for drawing chart
   * @createdDate 06-08-2019
   */
  draw() {
    if (this.settings && this.settings.canvas) {
      this._render.removeChild(this.chartContainer.nativeElement, this.settings.canvas);
      this.settings = null;
      this.settings = {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: DEFAULT_VALUE.PADDING_TOP as number,
        paddingBottom: 0
      };
    }
    if (this.dataValidations()) {
      this.prepareChart();
    }
  }

  ngOnInit() { }

  /** Private Method */
  /**
   * @author Hitesh Soni
   * @description Validate data before drawing chart
   * @createdDate 06-08-2019
   */
  private dataValidations() {
    //set nodata message
    this.chartOptions.noDataMessage = this.chartOptions.noDataMessage ? this.chartOptions.noDataMessage : DEFAULT_VALUE.NO_DATA_FOUND;
    let IsValid = true;
    if (!this.chartOptions || Object.keys(this.chartOptions).length == 0) {
      console.log("No any options and data found.");
      this.IsNoDataFound = true;
      IsValid = false;
    }
    else if (!this.chartOptions.yProperties) {
      console.log("y axis property not found.");
      IsValid = false;
    }
    else if (!this.chartOptions.data || this.chartOptions.data.length == 0) {
      console.log("no data found for draw gauge.");
      this.IsNoDataFound = true;
      IsValid = false;
    }
    else {
      this.IsNoDataFound = false;
      IsValid = true;
    }
    if (!IsValid) {
      this._render.setStyle(this.chartContainer.nativeElement, 'height', "0px");
    }
    this._cdr.markForCheck();
    return IsValid;
  }


  /**
   * @author Hitesh Soni
   * @description Main method for start step by step drawing
   * @createdDate 06-08-2019
   */
  private prepareChart() {
    //** STEP 1 CALCULATE CHART HEIGHT AND WIDTH */
    this.calculateChartArea();
    //** STEP 2 CREATE CANVAS ELEMENT */
    this.createCanvasElement();
    //** STEP 3 MAP SOME CHART OPTIONS */
    this.setOptions();
    //** STEP 4 CALCULATE Y AXIS VALUE */
    this.calculateYAxisValue();
    //** STEP 5 CALCULATE AXIS STEPS */
    this.axisStepCalculations();
    //** STEP 6 DRAW BASE LINE */
    this.drawBaseLine();
    //** STEP 6 DRAW GRID LINE LINE */
    this.drawGridLine();
    //** STEP 7 PLOAT LABLE ON AXIS */
    this.ploatLabelOnAxis();
    //** STEP 8 DRAW BAR CHART */
    this.drawBarChart();
    //** STEP 9 ADD HEADER */
    if (this.chartOptions.options && this.chartOptions.options.header && this.chartOptions.options.header.show) {
      this.addHeader();
    }
    this._cdr.markForCheck();
  }

  /**
   * @author Hitesh Soni
   * @description Calculate height and width for chart
   * @createdDate 07-08-2019
   */
  private calculateChartArea() {
    let style = window.getComputedStyle(this.chartContainer.nativeElement.parentNode.parentNode);
    if (!this.chartOptions || !this.chartOptions.height || this.chartOptions.height == 0) {
      this.chartOptions.height = DEFAULT_VALUE.CHART_HEIGHT;
    }
    if (!this.chartOptions || !this.chartOptions.width || this.chartOptions.width == 0) {
      this.chartOptions.width = this.chartContainer.nativeElement.offsetParent.offsetWidth -
        ((style.paddingRight ? parseInt(style.paddingRight.replace("px", "")) : 0) + (style.paddingLeft ? parseInt(style.paddingLeft.replace("px", "")) : 0));
    }
  }

  /**
  * @author Hitesh Soni
  * @description Create canvas element
  * @createdDate 07-08-2019
  */
  private createCanvasElement() {
    let _self = this;
    this.settings.canvas = document.createElement('canvas');
    this.settings.canvas.width = this.chartOptions.width;
    this.settings.canvas.height = this.chartOptions.height;
    this.settings.context = this.settings.canvas.getContext("2d");
    this.settings.context.setLineDash([0, 0]);
    this._render.appendChild(this.chartContainer.nativeElement, this.settings.canvas);
    this._render.setStyle(this.chartContainer.nativeElement, 'height', this.settings.canvas.height + "px");
    // this.settings.canvas.addEventListener("mousemove", function () {

    // });
  }

  /**
   * @author Hitesh Soni
   * @description Set some default options for chart
   * @createdDate 07-08-2019
   */
  private setOptions() {
    this.chartOptions.ticks = this.chartOptions.ticks ? this.chartOptions.ticks : DEFAULT_VALUE.TICKS;
    this.chartOptions.fontSize = this.chartOptions.fontSize ? this.chartOptions.fontSize : DEFAULT_VALUE.FONTSIZE;
    this.chartOptions.fontName = this.chartOptions.fontName ? this.chartOptions.fontName : DEFAULT_VALUE.FONT;
    this.settings.paddingBottom = (this.chartOptions.fontSize * 2) + DEFAULT_VALUE.PADDING_BOTTOM;
    this.chartOptions.baseLineColor = this.chartOptions.baseLineColor ? this.chartOptions.baseLineColor : DEFAULT_VALUE.BASE_LINE_COLOR;

    if (this.chartOptions.options.header && this.chartOptions.options.header.show) {
      this.chartOptions.options.header.fontName = this.chartOptions.options.header.fontName ? this.chartOptions.options.header.fontName : DEFAULT_VALUE.HEADER_FONTNAME;
      this.chartOptions.options.header.fontSize = this.chartOptions.options.header.fontSize ? this.chartOptions.options.header.fontSize : DEFAULT_VALUE.HEADER_FONTSIZE;
      this.chartOptions.options.header.color = this.chartOptions.options.header.color ? this.chartOptions.options.header.color : DEFAULT_VALUE.HEADER_FORCOLOR;
      //this.settings.paddingTop = this.chartOptions.options.header.fontSize * 2;
    }
  }

  /**
  * @author Hitesh Soni
  * @description Calculate y axis max,min and step value
  * @createdDate 07-08-2019
  */
  private calculateYAxisValue() {
    let yMax: number[] = [];
    for (let index = 0; index < this.chartOptions.yProperties.length; index++) {
      yMax.push(this._chartService.getMaxValue(this.chartOptions.yProperties[index].filedName, this.chartOptions.data));
    }
    //Calculte steps
    this.settings.yMin = 0;
    this.settings.yMax = Math.max(...yMax);
    let reminder = this.settings.yMax % 1;
    this.settings.yMax = this.settings.yMax + (1 - reminder);
    while ((this.settings.yMax % this.chartOptions.ticks) !== 0) {
      this.settings.yMax += 1;
    }
    this.settings.yStep = this.settings.yMax / this.chartOptions.ticks;
    this.settings.yMaxValueWidth = this._chartService.getTextWidth(this.settings.yMax.toString(), this.chartOptions.fontSize + "px " + this.chartOptions.fontName);
    this.settings.paddingLeft = Number((this.settings.yMaxValueWidth * 2).toFixed(0)) + this.settings.paddingLeft;
  }

  /**
 * @author Hitesh Soni
 * @description Chart setup data for drawing
 * @createdDate 07-08-2019
 */
  private axisStepCalculations() {
    let yRangeCount = 0;
    //calculate step size
    yRangeCount = ((((this.settings.yMax) - this.settings.yMin)) / this.settings.yStep);
    this.settings.xStepSize = parseFloat(((this.chartOptions.width - (this.settings.paddingLeft + this.settings.paddingRight + this.settings.yMaxValueWidth)) / this.chartOptions.data.length).toFixed(2));
    this.settings.yStepsize = parseFloat(((this.chartOptions.height - (this.settings.paddingTop + this.settings.paddingBottom)) / yRangeCount).toFixed(2))
    //clculate final chart area for drawing
    this.settings.areaHeight = this.settings.yStepsize * yRangeCount;
    this.settings.areaWidth = this.settings.xStepSize * this.chartOptions.data.length;
  }

  /**
  *@author Hitesh Soni
  *@description Draw base line and box for chart
  *@createdDate 07-08-2019
  */
  private drawBaseLine() {
    /** Box */
    this.settings.context.beginPath();
    this.settings.context.fillStyle = DEFAULT_VALUE.BACKGROUND_COLOR;
    this.settings.context.fillRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);
    // this.settings.context.strokeStyle = this.chartOptions.baseLineColor;
    // this.settings.context.lineWidth = 1;
    // this.settings.context.strokeRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);
    // this.settings.context.closePath();
    // this.settings.context.restore();
    // //draw x axis line
    this.settings.context.beginPath();
    this.settings.context.translate(0.5, 0.5);
    this.settings.context.strokeStyle = this.chartOptions.baseLineColor;
    let locationOfY = this.settings.canvas.height - this.settings.paddingBottom;
    this.settings.context.lineWidth = 1;
    this.settings.context.moveTo(this.settings.paddingLeft, locationOfY);
    this.settings.context.lineTo(this.settings.areaWidth, locationOfY);
    this.settings.context.stroke();
  }

  /**
  *@author Hitesh Soni
  *@description Draw grid line for y and x axis
  *@createdDate 07-08-2019
  */
  private drawGridLine() {
    let counter = this.settings.yMax;
    for (let y = this.settings.paddingTop; y <= (this.settings.areaHeight) + this.settings.paddingTop; y = y + this.settings.yStepsize) {
      this.settings.context.strokeStyle = this.chartOptions.baseLineColor;
      this.settings.context.beginPath();
      this.settings.context.moveTo(this.settings.paddingLeft, Math.round(y));
      this.settings.context.lineTo((this.settings.areaWidth + this.settings.paddingLeft), Math.round(y));
      this.settings.context.stroke();
      counter = counter - this.settings.yStep;
    }

    // //just for testing
    // for (let x = this.settings.paddingLeft; x <= (this.settings.areaWidth); x = x + this.settings.xStepSize) {
    //   this.settings.context.beginPath();
    //   // this.settings.context.strokeStyle = options.baseLineColor;
    //   // this.settings.context.translate(0.5, 0.5);
    //   this.settings.context.moveTo(x, this.settings.paddingTop);
    //   this.settings.context.lineTo(x, this.settings.areaHeight + this.settings.paddingTop);
    //   this.settings.context.stroke();
    //   this.settings.context.closePath();
    //   this.settings.context.restore();
    // }
  }

  /**
  *@author Hitesh Soni
  *@description Ploat lable on y and x axis
  *@createdDate 07-08-2019
  */
  private ploatLabelOnAxis() {
    //set x axis label
    this.settings.context.beginPath();
    this.settings.context.fillStyle = DEFAULT_VALUE.FOR_COLOR;
    this.settings.context.font = this.chartOptions.fontSize + "px " + this.chartOptions.fontName;
    this.settings.context.textAlign = "center";
    if (this.chartOptions.showXAxis) {
      let i = 0;
      this.settings.context.save();
      for (let x = this.settings.paddingLeft; x <= (this.settings.areaWidth + this.settings.paddingLeft) && (i < this.chartOptions.data.length); x = x + this.settings.xStepSize) {
        let filedValue = this.chartOptions.data[i][this.chartOptions.xProperty.filedName];
        let splitText = filedValue.split("\n");
        let counter = 1;
        splitText.forEach(element => {
          let textWidth = this._chartService.getTextWidth(element, this.chartOptions.fontSize + "px " + this.chartOptions.fontName);
          this.settings.context.fillText(element, (x + (this.settings.xStepSize / 2)), this.settings.paddingTop + Math.round(this.settings.areaHeight + ((this.chartOptions.fontSize * counter))));
          counter += 1;
        });
        i++;
      }
    }
    //set y axis label
    this.settings.context.beginPath();
    let range = this.settings.yMax;
    for (let y = this.settings.paddingTop; (y <= (this.settings.areaHeight + this.settings.paddingTop)); y = y + this.settings.yStepsize) {
      if (range >= this.settings.yMin) {
        this.settings.context.textAlign = "right";
        this.settings.context.fillText(range, (this.settings.paddingLeft) - 5, y + this.chartOptions.fontSize / 4);//set fix padding from lef
        range = range - this.settings.yStep;
      }
    }
    this.settings.context.textAlign = "start";
  }

  /**
   * @author Hitesh Soni
   * @description draw bar and staked column chart
   * @createdDate 01-05-2019
   */
  private drawBarChart() {
    let barWidth = Number((this.settings.xStepSize / 1.5).toFixed(1));
    let singleYPoint = this.settings.yStepsize / this.settings.yStep;
    this.settings.location = [];
    this.chartOptions.yProperties.forEach(element => {
      this.chartOptions.data.forEach(item => {
        let _xPoint, _yPoint, barHeight;
        let _xValue = item[this.chartOptions.xProperty.filedName];
        let _yValue = item[element.filedName];
        this.settings.context.beginPath();
        if (this.chartOptions.yProperties.length == 1) {
          _xPoint = this._chartService.findXLocation(this.chartOptions.data, this.chartOptions.xProperty.filedName, _xValue, this.settings) + this.settings.paddingLeft + (barWidth / 4);
          //y point location
          _yPoint = this.settings.paddingTop + singleYPoint * (this.settings.yMax - _yValue);

          barHeight = (this.settings.areaHeight - _yPoint) + this.settings.paddingTop - this.settings.context.lineWidth;
          this.settings.context.fillStyle = item[element.barColor];
          this.settings.context.rect(_xPoint, _yPoint, barWidth, barHeight);
          this.settings.context.fill();
          this.settings.location.push({ data: item, legendValue: { legendName: _xValue, legendColor: item[element.barColor] }, point: { x: _xPoint, y: _yPoint }, bar: { height: barHeight, width: barWidth } });
        }
      });
    });
  }

  /**
   * @author Hitesh Soni
   * @description add header 
   * @createdDate 07-08-2019
   */
  addHeader() {
    let xPoint = this.chartOptions.width / 2;
    let yPoint = this.settings.paddingTop - this.chartOptions.options.header.fontSize;
    this.settings.context.fillStyle = this.chartOptions.options.header.color;
    this.settings.context.font = this.chartOptions.options.header.fontSize + "px " + this.chartOptions.options.header.fontName;
    let textWidth = this._chartService.getTextWidth(this.chartOptions.options.header.text, this.settings.context.font);
    xPoint -= (textWidth / 2);
    this.settings.context.fillText(this.chartOptions.options.header.text, xPoint, yPoint);//set fix padding from lef
  }
}
