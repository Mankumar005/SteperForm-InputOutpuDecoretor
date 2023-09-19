import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ShipmentNowService } from '../../component-services/shipment-now.service';
import { NbToastrService } from '@nebular/theme';
import { UtilService } from '../../common- services/util.service';

@Component({
  selector: 'ngx-shipment-edit-view',
  templateUrl: './shipment-edit-view.component.html',
  styleUrls: ['./shipment-edit-view.component.scss']
})
export class ShipmentEditViewComponent implements OnInit {

  @Input() rowData: any;
  // @Output() click:EventEmitter<any> = new EventEmitter(this.rowData);
  public userDetails: any;
  public isDraft:any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  constructor(
          public router : Router,
          public shipmentNowService: ShipmentNowService,
          private toastrService: NbToastrService,
          public utilService: UtilService
          ){}

  ngOnInit(){
    this.isDraft = this.rowData.is_draft
    this.userDetails = this.utilService.getLocalStorageValue("userDetail");
    if(this.userDetails && this.userDetails.menu_permissions.length) {
      this.userDetails.menu_permissions.forEach((menuPermission: any) => {
        if(menuPermission.menu_code === 'SHIPMENTS') {
          if(menuPermission.children_menus && menuPermission.children_menus.length) {
            menuPermission.children_menus.forEach((childMenuPermission: any) => {
              if(childMenuPermission.menu_code === 'SHIPMENT_HISTORY') {
                if(childMenuPermission?.permissions?.length) {
                  childMenuPermission.permissions.forEach((childMenu: any) => {
                    if(childMenu.permission_slug === 'UPDATE') {
                      this.onPermission.update = true;
                    }
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

  public onEditShipNowDraftDetails(event:any):void {
    this.router.navigate([`/pages/shipments/book-shipments`], { queryParams: {shipment_booking_id : btoa(event.shipment_booking_id)}});
  }
  public onViewShipNowDetails(event:any):void {
    this.router.navigate([`/pages/shipments/shipments-history-details`], { queryParams: {book_id : btoa(event.shipment_booking_id)}});
  }

  printLabelById(event: any){
    // this.isLoading = true;
    this.shipmentNowService.printLabelById(event.shipment_booking_id).subscribe((res: any) => {
      if(res.data.url){
        // this.toastrService.success(res.message, "Success");
        setTimeout(() => {
        window.open(res.data.url, "_blank");
        },1000);
      }
      // this.isLoading = false;
      },(error) => {
        // this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      })
  }
}
