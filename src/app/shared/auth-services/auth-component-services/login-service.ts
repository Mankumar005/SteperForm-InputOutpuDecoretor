import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../http-header.service';
 
@Injectable({
  providedIn: 'root'
})
export class loginService {

    public base: string = 'auth/';

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public userSignIn(data:FormData){
        return this._httpHeaderService.post(this.base + 'login', data);
        }
}