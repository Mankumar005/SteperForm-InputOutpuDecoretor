import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../http-header.service';
 
@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public changeUserPassword(data:any){
        return this._httpHeaderService.post('users/password-change', data);
        }
}