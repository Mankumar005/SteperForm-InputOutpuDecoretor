import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { httpHeaderRequstService } from '../http-header.service';
import { HttpClient } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
})
export class registerService {

    constructor(private _httpHeaderService : httpHeaderRequstService) { }

    public sendUserRegisterData(data:any): Observable<any>{
      return this._httpHeaderService.post(`auth/register`,data);
    }
 
    public onCheckUniqueEmailID(data:any): Observable<any>{
      return this._httpHeaderService.post(`auth/validate-email`,data);
    }

    public getCountryList(): Observable<any>{
      return this._httpHeaderService.get(`countries?search=`);
    }

    public getStateDataById(country_id:any): Observable<any>{
      return this._httpHeaderService.get(`states?search=&country_id=${country_id}`);
    }
    
    public getCountryData() {
      return this._httpHeaderService.get(`address-country?order_by=country_id&sort_by=ASC`);
  }

  //get dropdown value //

  public getShippingTypesList(): Observable<any>{
    return this._httpHeaderService.get(`shipping-service-types`);
  }

  public getNatuerBusinessList(): Observable<any>{
    return this._httpHeaderService.get(`nature-of-businesses?`);
  }

  public getShipmentFrequenciesList(): Observable<any>{
    return this._httpHeaderService.get(`shipment-frequencies?`);
  }

  //verify phone or email //
  public sendOTPOnPhoneOrEmail(data:any): Observable<any>{
    return this._httpHeaderService.post(`generate-otp`,data);
  }

  public verifyPhoneOrEmailOTP(data:any): Observable<any>{
    return this._httpHeaderService.post(`verify-otp`,data);
  }

}
