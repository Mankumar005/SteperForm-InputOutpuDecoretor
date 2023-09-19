import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
 
@Injectable({
  providedIn: 'root'
})
export class HsnCodeService {


    constructor(private _httpHeaderService : httpHeaderRequstService) { }

   
    public getHSNCodeList(): Observable<any> {
        return this._httpHeaderService.get(`harmonized-system-code?search=&order_by=harmonized_system_code_id&sort_by=DESC`);
      }

    public getHSNCodeDataById(id:any): Observable<any> {
      return this._httpHeaderService.get(`harmonized-system-code/${id}`);
    }

    public onSaveHSNData(data:any): Observable<any> {
      return this._httpHeaderService.post(`harmonized-system-code/store-update`,data);
    }

    public onDeleteHSNCode(id:any){
      return this._httpHeaderService.delete(`harmonized-system-code/${id}`);
    }

}