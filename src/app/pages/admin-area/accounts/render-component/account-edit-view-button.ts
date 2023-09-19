import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../../shared/common- services/util.service';

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="nb-view pointer view-icon" nbTooltip="View" nbTooltipPlacement="bottom" icon="eye-outline" (click)="onViewAccountsDetails(rowData)"
  *ngIf="onPermission?.view"></nb-icon>
  `,
})
export class AccountRenderComponent {
  @Input() rowData: any;
  public userDetails: any;
  public pageName: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  constructor(
    public router: Router,
    public utilService: UtilService,
    public activatedRoute: ActivatedRoute
              ) { 
    this.pageName = this.activatedRoute.snapshot.url[0].path;
    this.userDetails = this.utilService.getLocalStorageValue("userDetail");
    if (this.userDetails && this.userDetails.menu_permissions.length) {
      this.userDetails.menu_permissions.forEach((menuPermission: any) => {
        if (menuPermission.menu_code === 'ADMIN_AREA') {
          if (menuPermission.children_menus && menuPermission.children_menus.length) {
            menuPermission.children_menus.forEach((childMenuPermission: any) => {
              if (childMenuPermission.menu_code === 'ACCOUNTS') {
                if (childMenuPermission.children_menus && childMenuPermission.children_menus.length) {
                  childMenuPermission.children_menus.forEach((childInChildMenu: any) => {
                    if(childInChildMenu.menu_code === 'APPROVED_ACCOUNT' && this.pageName === 'approved-account') {
                      if(childMenuPermission?.permissions?.length) {
                        childMenuPermission.permissions.forEach((childMenu: any) => {
                          if(childMenu.permission_slug === 'VIEW') {
                            this.onPermission.view = true;
                          }
                        });
                      }
                    }
                    if(childInChildMenu.menu_code === 'PENDING_ACCOUNT' && this.pageName === 'pending-account') {
                      if(childMenuPermission?.permissions?.length) {
                        childMenuPermission.permissions.forEach((childMenu: any) => {
                          if(childMenu.permission_slug === 'VIEW') {
                            this.onPermission.view = true;
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    }
  }

public onViewAccountsDetails(event:any):void {
        if(event.is_approved == 0){
            this.router.navigate([`/pages/admin-area/accounts/account-details`], { queryParams: {user_id : btoa(event.user_id) ,account_type : 'pending'}});
        }else if(event.is_approved == 1){
            this.router.navigate([`/pages/admin-area/accounts/account-details`], { queryParams: {user_id : btoa(event.user_id) ,account_type : 'approved'}});
            this.utilService.storeLocalStorageValue('approved_user_id',event.user_id)
        }else if(event.is_approved == 2){
            this.router.navigate([`/pages/admin-area/accounts/account-details`], { queryParams: {user_id : btoa(event.user_id) ,account_type : 'rejected'}});
        }
}
 
}