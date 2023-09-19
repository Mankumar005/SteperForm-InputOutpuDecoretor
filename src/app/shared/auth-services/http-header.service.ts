import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
 
@Injectable({
    providedIn: 'root'
})
export class httpHeaderRequstService {

    constructor(private http: HttpClient) {
    }

    private _commonHeaders = {
        headers: new HttpHeaders({
            'Accept': 'application/json',
            // 'Content-Type': 'application/json',
        })
    }

    private getUrlSearchParams(paramsObject: any): HttpParams {
        let urlSearchParams = new HttpParams();
        if (paramsObject) {
            Object.keys(paramsObject).forEach(key => {
                if (Array.isArray(paramsObject[key])) {
                    paramsObject[key].map((arrayValue: any) => {
                        if(key === 'p_field') {
                            urlSearchParams = urlSearchParams.append(key+'[]', arrayValue);
                        } else {
                            urlSearchParams = urlSearchParams.append(key, arrayValue);
                        }
                    });
                } else {
                    urlSearchParams = urlSearchParams.append(key, paramsObject[key]);
                }
            })
        }
        return urlSearchParams;
    }

    // set authentication tocken
    setHeader() {
        if (localStorage.getItem('access_token')) {
            const httpOptions = {
                headers: new HttpHeaders({
                    // 'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'), 
                   
                }),                
            }
            return httpOptions;
        } else {
            return null;
        }
    }

    setObserveHeader() {
        if (this.isLogin) {
            const httpOptions = {
                headers: new HttpHeaders({
                    // 'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.getAuthorization, 
                   
                }),
                observe: 'response' as 'response',
                 
            }
            return httpOptions;
        } else {
            return null;
        }
    }

    get(url: string, params?: any, withClientKey: boolean = false,isObserve=false) {
        let userHeaders ;
        if(isObserve){
            userHeaders=this.setObserveHeader();
        }else{
        userHeaders=this.setHeader();
        }
        let httpSearchParams = this.getUrlSearchParams(params);

        if (userHeaders) {
            return this.http.get(environment.apiHostURL + url + httpSearchParams, userHeaders);
        } else {
            return this.http.get(environment.apiHostURL + url + httpSearchParams, this._commonHeaders);
        }
    };

    post(url: string, data?: any, withClientKey: boolean = false) {
        let userHeaders = this.setHeader();
        if (userHeaders) {
            return this.http.post(environment.apiHostURL + url, data, userHeaders);
        } else {
            return this.http.post(environment.apiHostURL + url, data, this._commonHeaders);
        }
    };

    postWithFormData(url: string, data: FormData): Observable<any> {
        // let currentUser = JSON.parse(sessionStorage.getItem(environment.token_name));
        const headers = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                // 'ClientKey': currentUser.clientKey
            })
        }
        return this.http.post(environment.apiHostURL + url, data, headers)
    };

    putWithFormData(url: string, data: FormData): Observable<any> {
        const headers = {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                // 'ClientKey': currentUser.clientKey
            })
        }
        return this.http.put(environment.apiHostURL + url, data, headers)
    };

    postWithFormDataNProgress(url: string, data: FormData): Observable<any> {
        // let currentUser = JSON.parse(sessionStorage.getItem(environment.token_name));
        const headers: any = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            // 'ClientKey': currentUser.clientKey
        })
        return this.http.post(environment.apiHostURL + url, data, { headers, reportProgress: true, observe: "events" })
    };
    /* fileUpload(url: string, data: any) {
        let currentUser = JSON.parse(sessionStorage.getItem(environment.token_name));
        let headers = new HttpHeaders({
            'Authorization': 'Bearer ' + currentUser.token
        })
        return this.http.post(environment.apiHostURL + url, data, { headers: headers });
    }; */

    put(url: string, data?: any, withClientKey: boolean = false) {
        let userHeaders = this.setHeader();
        if (userHeaders) {
            return this.http.put(environment.apiHostURL + url, data, userHeaders);
        } else {
            return this.http.put(environment.apiHostURL + url, data, this._commonHeaders);
        }
    };

    delete(url: string, data?: any, withClientKey: boolean = false) {
        let userHeaders = this.setHeader();
        if (userHeaders) {
            return this.http.delete(environment.apiHostURL + url, userHeaders)
        } else {
            return this.http.delete(environment.apiHostURL + url, this._commonHeaders)
        }
    };

    public get getAuthorization() {
        return localStorage.getItem('access_token')?localStorage.getItem('access_token'):''
    }

    public get isLogin(): boolean {
        return localStorage.getItem('access_token') ? true : false
    }
}