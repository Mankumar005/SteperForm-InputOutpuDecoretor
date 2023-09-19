import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AccountService {


    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public getApprovedAccountData(status:any): Observable<any>{
        return this._httpHeaderService.get(`users?search=&order_by=user_id&sort_by=DESC&is_active=${status}&is_approved=1`);
        }

    public getPendingAccountData(account_type_id): Observable<any> {
          return this._httpHeaderService.get(`users?search=&order_by=user_id&sort_by=DESC&is_active=&is_approved=${account_type_id}`);
        }
      
    public onActiveDeactiveAccount(data:any): Observable<any> {
          return this._httpHeaderService.post('users/status-update',data);
        }

    public onApproveRejectAccount(data:any): Observable<any> {
      return this._httpHeaderService.post('users/status-update',data);
    }

    public getApprovedAndPendingAccountDetailsById(user_id:any): Observable<any>{
        return this._httpHeaderService.get(`users/${user_id}`);
        }     

    public onSendActiveDeactiveUserData(data:any): Observable<any>{
      return this._httpHeaderService.post(`users/account-status-update`,data);
    }

    public accountResetPassword(data:any): Observable<any>{
      return this._httpHeaderService.post(`users/customer-change-password`,data);
    }

    public getCustomerTierData(): Observable<any>{
      return this._httpHeaderService.get(`customer-tier?`);
    }

    // user account update //
    public userAccountUpdate(data:any): Observable<any>{
      return this._httpHeaderService.post(`user-update`,data);
    }
    //sub user account update //

    public addUpdateSubAccountData(data:any): Observable<any>{
      return this._httpHeaderService.post(`sub-user-store-update`,data);
    }

    public getSubAccountListData(): Observable<any>{
      return this._httpHeaderService.get(`sub-user-list?order_by=user_id&sort_by=DESC&is_active=&is_approved=&parent_id=`);
    }

    public getSubAccountDetailsData(user_id:any,parent_id:any): Observable<any>{
      return this._httpHeaderService.get(`sub-user-detail?user_id=${user_id}&parent_id=${parent_id}`);
    }
}