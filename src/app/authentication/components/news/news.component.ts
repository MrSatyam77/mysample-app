// External imports
import { Component, OnInit, Injector } from '@angular/core';
// Internal imports
import { AuthenticationService } from '@app/authentication/authentication.service';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  public newsList: any = [];
  constructor(private _injector: Injector) { }

  /**
   * @author om kanada
   * @description
   *   this function is used to get news Data
   */

  initialGetNews(): void {
    const authenticationService = this._injector.get(AuthenticationService);
    authenticationService.getNews(3).then((response) => {
      this.newsList = response;
    }, (error) => {
      this.newsList = [];
    });


  }
  ngOnInit() {
    this.initialGetNews();
  }

}
