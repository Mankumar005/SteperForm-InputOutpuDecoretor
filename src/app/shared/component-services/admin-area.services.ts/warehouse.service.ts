import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
 
@Injectable({
  providedIn: 'root'
})
export class WareHouseService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

   
  
  public getWarehouseList(): Observable<any> {
      return this._httpHeaderService.get(`vayulogi-locations?search=&order_by=vayu_logi_location_id&sort_by=DESC&country_id=&state_id=`);
    }

  public getCountryList(): Observable<any> {
      return this._httpHeaderService.get(`address-country?search=&order_by=country_id&sort_by=ASC`);
    }  

  public getStateListById(country_id:any): Observable<any> {
      return this._httpHeaderService.get(`states?search=&country_id=${country_id}&order_by=state_name&sort_by=ASC`);
    }
    
  public getWarehouseDataById(id:any): Observable<any> {
    return this._httpHeaderService.get(`vayulogi-locations/${id}`);
  }

  public onSaveWarehouseData(data:any): Observable<any> {
    return this._httpHeaderService.post(`vayulogi-locations/store-update`,data);
  }

  public deleteWarehouseData(id:any){
    return this._httpHeaderService.delete(`vayulogi-locations/${id}`);
  }


}