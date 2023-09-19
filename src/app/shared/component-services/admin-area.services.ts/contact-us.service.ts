import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    // ContactUs Services //
    public getContactUsList(): Observable<any> {
        return this._httpHeaderService.get(`contact-us?search=&order_by=contact_us_id&sort_by=DESC`);
      }

    // FAQ Services //
    public getContactUsDataId(id:any): Observable<any> {
      return this._httpHeaderService.get(`contact-us/${id}`);
    }

}