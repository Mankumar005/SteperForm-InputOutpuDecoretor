import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from '../../../../shared/common- services/util.service';

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="view-icon pointer nb-view" nbTooltip="View" nbTooltipPlacement="bottom" icon="eye-outline" (click)="onViewContactDetails(rowData)"
  *ngIf="onPermission?.view"></nb-icon>
  `,
})
export class ContectUsRenderComponent {
  public userDetails: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  @Input() rowData: any;

  constructor(  
    public router: Router,
    public utilService: UtilService
    ) {
      this.userDetails = this.utilService.getLocalStorageValue("userDetail");
      if (this.userDetails && this.userDetails.menu_permissions.length) {
        this.userDetails.menu_permissions.forEach((menuPermission: any) => {
          if (menuPermission.menu_code === 'ADMIN_AREA') {
            if (menuPermission.children_menus && menuPermission.children_menus.length) {
              menuPermission.children_menus.forEach((childMenuPermission: any) => {
                if (childMenuPermission.menu_code === 'CONTACT_US') {
                  if (childMenuPermission.children_menus && childMenuPermission.children_menus.length) {
                    childMenuPermission.children_menus.forEach((childInChildMenu: any) => {
                      if(childInChildMenu.menu_code === 'CONTACT_US_LIST') {
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

public onViewContactDetails(event:any):void {
    this.router.navigate([`/pages/admin-area/contact-us/contact-us-detail`], { queryParams: {contact_us_id : btoa(event.contact_us_id)}});
}
 
}