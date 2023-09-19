import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdServices implements CanActivate, CanActivateChild,CanLoad {


  constructor( private router: Router,
              private jwtHelper: JwtHelperService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('access_token') ){
        return true;
      } else {
        this.router.navigateByUrl('');
        return false;
      }
  }
  canLoad(route: ActivatedRouteSnapshot):  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  if (localStorage.getItem('access_token') ){
    let getToken =  this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    if(getToken){
      if(getToken.role == 'CUSTOMER'){
        this.router.navigateByUrl('pages/dashboard');
        return false;
      }
    }else{
      return true;
     }
  }
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('access_token') ){
        this.router.navigateByUrl('pages/dashboard');
        return true;
      }
  }
 
}
