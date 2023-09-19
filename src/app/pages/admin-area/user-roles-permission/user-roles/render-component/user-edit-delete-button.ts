import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { UtilService } from '../../../../../shared/common- services/util.service';
import { Subscription } from 'rxjs';
import { ConfirmModalComponent } from '../../../../../shared/modal-services/confirm-modal/confirm-modal.component';
import { UserRolesService } from '../../../../../shared/component-services/admin-area.services.ts/user-role.service';

@Component({
  selector: 'ngx-account-view',
  template: `
  <nb-icon class="edit-icon pointer nb-edit" nbTooltip="Edit" nbTooltipPlacement="bottom" (click)="onEditUser(rowData)"
  *ngIf="onPermission?.update"></nb-icon>
  <nb-icon class="delete-icon pointer nb-trash" nbTooltip="Delete" nbTooltipPlacement="bottom" (click)="onDeleteUser(rowData)"
  *ngIf="onPermission?.delete"></nb-icon>
  `,
})
export class UserRenderComponent {
  public subscription: Subscription[] = [];
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
    public userRoleService: UserRolesService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public router: Router,
    public utilService: UtilService
    ) {
      this.userDetails = this.utilService.getLocalStorageValue("userDetail");
      if (this.userDetails && this.userDetails.menu_permissions.length) {
        this.userDetails.menu_permissions.forEach((menuPermission: any) => {
          if (menuPermission.menu_code === 'ADMIN_AREA') {
            if (menuPermission.children_menus && menuPermission.children_menus.length) {
              menuPermission.children_menus.forEach((childMenuPermission: any) => {
                if (childMenuPermission.menu_code === 'MASTER') {
                  if (childMenuPermission.children_menus && childMenuPermission.children_menus.length) {
                    childMenuPermission.children_menus.forEach((childInChildMenu: any) => {
                      if(childInChildMenu.menu_code === 'USER_ROLES_LIST') {
                       if(childMenuPermission?.permissions?.length) {
                          childMenuPermission.permissions.forEach((childMenu: any) => {
                            if(childMenu.permission_slug === 'UPDATE') {
                              this.onPermission.update = true;
                            }
                            if(childMenu.permission_slug === 'DELETE') {
                              this.onPermission.delete = true;
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

public onEditUser(event:any):void {
    this.router.navigate([`/pages/admin-area/user-roles/add-edit-user-roles`], { queryParams: {roleId : btoa(event.role_id)}});
}
 

public onDeleteUser(event: any): void {
  this.dialogService.open(ConfirmModalComponent, {
      context: {
        data: "Are you sure want to delete?",
      },
    })
    .onClose.subscribe((confirm: any) => {
      if (confirm) {
        // event.confirm.resolve(event.newData);
       this.userRoleService.onDeleteUserRole(event.role_id).subscribe(
              (res: any) => {
                this.toastrService.success(res.message, "Success");
                this.utilService.deleteEmmiter.next(true);
              },
              (error) => {
                if (  error &&  error.error.errors &&error.error.errors.failed) {
                  this.toastrService.danger(  error.error.errors.failed[0],"Error" );
                }
              }
            );
      }
    });
}
}