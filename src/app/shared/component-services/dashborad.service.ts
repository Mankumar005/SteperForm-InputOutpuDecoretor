import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../auth-services/http-header.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    constructor(private _httpHeaderService : httpHeaderRequstService) { }

      public getcustomerBalanceData(user_id:any): Observable<any> {
        return this._httpHeaderService.get(`customer-wallet-amount?user_id=&user_id=${user_id}`);
      }
  
}