import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShipmentStatusService } from '../../../../shared/component-services/admin-area.services.ts/shipment-status.services';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ConfirmModalComponent } from '../../../../shared/modal-services/confirm-modal/confirm-modal.component';

@Component({
  selector: 'ngx-account-view',
  template: `
         <i nbTooltip="Edit" nbTooltipPlacement="bottom" class="edit-icon pointer nb-edit" (click)="onEditHSNCode(rowData)"
         *ngIf="onPermission?.update"></i>
         <i nbTooltip="Delete" nbTooltipPlacement="bottom" class="delete-icon pointer nb-trash" (click)="onDeleteHSNCode(rowData)"
         *ngIf="onPermission?.delete"></i>`,
})
export class ShipmentStatusRenderComponent {
  @Input() rowData: any;
  public userDetails: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  constructor(  
    public shipmentStatusService: ShipmentStatusService,
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
                      if(childInChildMenu.menu_code === 'SHIPMENT_STATUS_LIST') {
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

public onEditHSNCode(event:any):void {
    this.router.navigate([`/pages/admin-area/shipment-status/add-edit-shipment-status`], {queryParams: { shipment_status_id: btoa(event.order_status_id) },});
}
 
public onDeleteHSNCode(event: any): void {
    this.dialogService
      .open(ConfirmModalComponent, {
        context: {
          data: "Are you sure want to delete?",
        },
      })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          // event.confirm.resolve(event.newData);
        this.shipmentStatusService.onDeleteOrderStatusCode(event.order_status_id).subscribe(
                (res: any) => {
                  this.toastrService.success(res.message, "Success");
                  this.utilService.deleteEmmiter.next(true);
                },
                (error) => {
                  if (  error &&  error.error.errors &&error.error.errors.failed
                  ) {
                    this.toastrService.danger(  error.error.errors.failed[0],"Error" );
                  }
                }
              )
          
        }
      });
  }


}