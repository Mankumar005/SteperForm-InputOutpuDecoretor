 
import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from './http-header.service';
 

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  public base: string = 'auth/';

  constructor(private httpHeaderRequestService: httpHeaderRequstService) { }

  public loginUser(data:FormData){
    return this.httpHeaderRequestService.post(this.base + 'login', data);
  }

}
