import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ReportService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public getReportByDate(start_date:any,end_date:any): Observable<any> {
      return this._httpHeaderService.get(`shipment-report?search=&order_by=shipment_booking_id &sort_by=DESC&start_date=${start_date}&end_date=${end_date}&type`);
    }

}