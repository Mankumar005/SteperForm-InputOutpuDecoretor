import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../../auth-services/http-header.service';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public getUserList(): Observable<any> {
      return this._httpHeaderService.get(`user-management/users?search=&role_id=&order_by=user_id&sort_by=DESC`);
    }

    public addUpdateUserData(data:any): Observable<any> {
      return this._httpHeaderService.post(`user-management/users/store-update`,data);
    } 

    public getUserDetailBydId(id:any): Observable<any> {
      return this._httpHeaderService.get(`user-management/users/${id}`);
    } 

    public onDeleteUser(id:any): Observable<any> {
      return this._httpHeaderService.get(`user-management/users/${id}`);
    } 

    public getAllPermission(params: any) {
      return this._httpHeaderService.get(`user-management/permissions?`,params);
    }
  
    public getAllMenus(data?: any) {
      return this._httpHeaderService.get(`menus?`, data);
    }
  
    public saveRole(data: any) {
      return this._httpHeaderService.postWithFormData(`user-management/users/store-update`, data);
    }
  
    public getRoleById(id: any) {
      return this._httpHeaderService.get(`user-management/users/${id}`);
    }

    public getRegistrationRolesDetail(id: any) {
      return this._httpHeaderService.get(`user-management/roles/${id}`);
    }
  
    public manageRegistrationRoles(data: any) {
      return this._httpHeaderService.post(`user-management/roles/store-update`, data);
    }

    public getUserRoleList(): Observable<any> {
      return this._httpHeaderService.get(`user-management/roles?search=&order_by=role_id&sort_by=DESC`);
    }

    public onDeleteUserRole(id:any): Observable<any> {
      return this._httpHeaderService.delete(`user-management/roles/${id}`);
    } 
}