import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class FAQService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public getFAQData(): Observable<any> {
      return this._httpHeaderService.get(`faq?search=&page_no=1&per_page=100&order_by=faq_id&sort_by=DESC`);
    }

    public addUpdateFAQData(data:any): Observable<any> {
      return this._httpHeaderService.post(`faq/store-update`,data);
    } 

    public getFaqDetailsBydId(id:any): Observable<any> {
      return this._httpHeaderService.get(`faq/${id}`);
    } 


}