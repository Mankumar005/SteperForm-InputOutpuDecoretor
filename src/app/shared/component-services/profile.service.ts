import { Injectable } from '@angular/core';
import { httpHeaderRequstService } from '../auth-services/http-header.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
    constructor(private _httpHeaderService : httpHeaderRequstService) { }

      public getProfileDetailsById(): Observable<any> {
        return this._httpHeaderService.get(`user-profile`);
      }

      public onUpdateProfileData(data:any): Observable<any> {
        return this._httpHeaderService.post('user-profile-update',data);
      }
}