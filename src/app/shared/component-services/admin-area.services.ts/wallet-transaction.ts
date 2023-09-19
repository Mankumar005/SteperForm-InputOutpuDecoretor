import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class WalletTransactionService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public getCustomerData(customer_name:any): Observable<any> {
        return this._httpHeaderService.get(`customer-list?search=${customer_name}&order_by=user_id&sort_by=DESC`);
      } 

    public findCustomerWalletTransactionHistory(payloadObj:any): Observable<any> {
      return this._httpHeaderService.get(`customer-transaction-history?user_id=${payloadObj.user_id}&start_date=${payloadObj.start_date}&end_date=${payloadObj.end_date}&order_by=customer_wallet_transection_id &sort_by=DESC`);
    } 
    
    public getReportByDate(start_date:any,end_date:any): Observable<any> {
        return this._httpHeaderService.get(`shipment-report?search=&order_by=shipment_booking_id &sort_by=DESC&start_date=${start_date}&end_date=${end_date}&type`);
    }
}