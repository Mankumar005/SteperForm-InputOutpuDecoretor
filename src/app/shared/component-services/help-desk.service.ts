import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../auth-services/http-header.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HelpDeskService {
    constructor(private _httpHeaderService : httpHeaderRequstService) { }
      //Contact Us Services //
      public onSaveContactUsData(data:any): Observable<any> {
          return this._httpHeaderService.post('contact-us',data);
        }
      // FAQ Services //
      public getFAQData(): Observable<any> {
        return this._httpHeaderService.get(`faq?search=&page_no=1&per_page=100&order_by=faq_id&sort_by=DESC`);
      }
}