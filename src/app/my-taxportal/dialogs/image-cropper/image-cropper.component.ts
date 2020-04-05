import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {

  @ViewChild('imagePicker', { static: true }) imagePicker;

  public data: any;
  private croppedImage: string;

  constructor(private activeModal: NgbActiveModal) { }

  /**
   * @author Ravi Shah
   * This function get calls when the image is being cropped
   * @param {ImageCroppedEvent} event
   * @memberof ImageCropperComponent
   */
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  /**
   * @author Ravi Shah
   * Cancel Handler to close the dialog
   * @memberof ImageCropperComponent
   */
  cancel() {
    this.activeModal.close();
  }

  cropImage() {
    this.activeModal.close({ image: this.croppedImage });
  }

  ngOnInit() { }
}
