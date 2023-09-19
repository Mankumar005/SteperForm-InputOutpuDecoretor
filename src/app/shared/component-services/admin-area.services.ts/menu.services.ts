import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class MenuService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public getMenuData(obj: any): Observable<any> {
      return this._httpHeaderService.get(`menus?search=${(obj.search) ? obj.search : ''}&page_no=${obj.page_no}&per_page=${obj.per_page}&order_by=${obj.order_by}&sort_by=${obj.sort}&parent_id=0`);
    }

    public onSaveMenuData(data:any): Observable<any> {
      return this._httpHeaderService.post(`menus/store-update`,data);
    }

    public onDeleteMenu(menu_id:any): Observable<any> {
      return this._httpHeaderService.delete(`menus/${menu_id}`);
    }
}