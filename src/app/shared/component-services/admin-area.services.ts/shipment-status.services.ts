import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
 
@Injectable({
  providedIn: 'root'
})
export class ShipmentStatusService {


    constructor(private _httpHeaderService : httpHeaderRequstService) { }

   
    public getShipmentStatusList(): Observable<any> {
        return this._httpHeaderService.get(`order-status?search=&order_by=display_order&sort_by=DESC`);
      }

    public getOrderStatusDataById(id:any): Observable<any> {
      return this._httpHeaderService.get(`order-status/${id}`);
    }

    public onSaveOrderStatusata(data:any): Observable<any> {
      return this._httpHeaderService.post(`order-status/store-update`,data);
    }

    public onDeleteOrderStatusCode(id:any){
      return this._httpHeaderService.delete(`order-status/${id}`);
    }

}