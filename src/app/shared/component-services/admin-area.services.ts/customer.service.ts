import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public saveWalletData(data:any): Observable<any> {
      return this._httpHeaderService.post(`customer-wallet-transection`,data);
    }

    public getPaymentModeData(): Observable<any> {
      return this._httpHeaderService.get(`wallet-payment-mode`);
    }

    public getcustomerBalanceData(customer_id:any): Observable<any> {
      return this._httpHeaderService.get(`customer-wallet-amount?user_id=&customer_id=${customer_id}`);
    }

    public getCustomerLeserData(payloadObj:any): Observable<any> {
        return this._httpHeaderService.get(`customer-wallet-transection?search=&customer_id=${payloadObj.customer_id}&transection_type=${payloadObj.transection_type}&order_by=customer_wallet_transection_id&sort_by=DESC`);
    }
}