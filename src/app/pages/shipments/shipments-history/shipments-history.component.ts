import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { Subscription } from 'rxjs';
import { ShipmentNowService } from '../../../shared/component-services/shipment-now.service';
import { UtilService } from '../../../shared/common- services/util.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ShipmentEditViewComponent } from '../../../shared/render-component/shipment-edit-view/shipment-edit-view.component';
import * as moment from 'moment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-shipments-history',
  templateUrl: './shipments-history.component.html',
  styleUrls: ['./shipments-history.component.scss']
})
export class ShipmentsHistoryComponent {
  public subscription: Subscription[] = [];
  public shipmentHistoryData: Array<any> = [];
  public isLoading: boolean = false;
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount:any;
  public userDetails: any;

  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  settings = {
    actions:false,
    mode: 'external', 
      pager:{
      display: true,
      perPage: this.showPerPage,
    },
 
    columns: {
      index:{
        title: 'No',
        type: 'string',
        sort: false,
        filter:false,
        valuePrepareFunction : (val,row,cell)=>{
          const pager = this.source.getPaging();
          const ret = (pager.page-1) * pager.perPage + cell.row.index+1;
          return ret;
       },
       
      },
      booking_no: {
        title: 'Tracking No',
        type: 'number',
      },
      shipment_date: {
        title: 'Booking Date',
        type: 'date',
      },
      sender_contact_name: {
        title: 'Sender Name',
        type: 'string',
      },
      recipient_contact_name: {
        title: 'Recipient Name',
        type: 'string',
      },
      declared_value: {
        title: 'Value',
        type: 'number',
        sort: false,
      },
      service_type_name: {
        title: 'Service Type',
        type: 'string',
      },
      package_type_name: {
        title: 'Package Type',
        type: 'string',
      },
      shipment_price:{
        title: 'Shipment Price',
        type: 'number',
        sort: false,
      },
      status: {
        title: 'Status',
        type: 'string',
      },
      actions: {
        title: 'Action',
        type: 'custom',
        filter:false,
        sort: false,
        position: 'right',
        valuePrepareFunction: (cell, row) => row, 
        renderComponent: ShipmentEditViewComponent,
    },
  }}

  source: LocalDataSource = new LocalDataSource();

  public formValidations: any = {
    status: [{ type: 'required', message: ' Status is required' }]
  };

  constructor(
    private service: SmartTableData,
    public utilService: UtilService,
    public shipmentNowService: ShipmentNowService,
    private toastrService: NbToastrService,
    public router : Router,
    private fb: UntypedFormBuilder
    ) {
    
      this.userDetails = this.utilService.getLocalStorageValue("userDetail");
      if(this.userDetails && this.userDetails.menu_permissions.length) {
        this.userDetails.menu_permissions.forEach((menuPermission: any) => {
          if(menuPermission.menu_code === 'SHIPMENTS') {
            if(menuPermission.children_menus && menuPermission.children_menus.length) {
              menuPermission.children_menus.forEach((childMenuPermission: any) => {
                if(childMenuPermission.menu_code === 'SHIPMENT_HISTORY') {
                  if(childMenuPermission?.permissions?.length) {
                    childMenuPermission.permissions.forEach((childMenu: any) => {
                      if(childMenu.permission_slug === 'CREATE') {
                        this.onPermission.create = true;
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }

    this.getShipmentHistories();
  }

  getShipmentHistories() {
    this.isLoading = true;
      this.subscription.push(
        this.shipmentNowService.getShipmentHistoryData().subscribe(
          (res: any) => {
            if(res && res.data) {
              this.shipmentHistoryData = [];
              res.data.forEach((element: any) => {
                this.shipmentHistoryData.push(
                  {
                    booking_no: element.booking_no,
                    shipment_date: (element.shipment_booking_package && element.shipment_booking_package.shipment_date) ? moment.utc(element.shipment_booking_package.shipment_date).local().format("DD-MM-YYYY") : '',
                    sender_contact_name: (element.shipment_booking_sender && element.shipment_booking_sender.contact_name) ? element.shipment_booking_sender.contact_name : '',
                    recipient_contact_name: (element.shipment_booking_recipient && element.shipment_booking_recipient.contact_name) ? element.shipment_booking_recipient.contact_name : '',
                    declared_value: (element.shipment_booking_package && element.shipment_booking_package.declared_value) ? '₹'+element.shipment_booking_package.declared_value : '₹'+0,
                    service_type_name: ( element.shipment_booking_package && element.shipment_booking_package.service_type && element.shipment_booking_package.service_type.service_type_name) ? element.shipment_booking_package.service_type.service_type_name : '',
                    package_type_name: (element.shipment_booking_package && element.shipment_booking_package.package_type && element.shipment_booking_package.package_type.package_type_name) ? element.shipment_booking_package.package_type.package_type_name : '',
                    status: element.is_draft ? 'Draft' : 'Confirm',
                    updated_by_user: element.updated_by_user,
                    updated_at: element.updated_at,
                    shipment_booking_status: element.shipment_booking_status,
                    user_id: element.user_id,
                    shipment_booking_id: element.shipment_booking_id,
                    is_parcll: element.is_parcll,
                    is_draft: element.is_draft,
                    is_active: element.is_active,
                    created_by_user: element.created_by_user,
                    created_at: element.created_at,
                    confirmed_by_user: element.confirmed_by_user,
                    shipment_price: (element.shipment_price) ? '₹'+element.shipment_price : ''
                  }
                )
                this.isLoading = false;
              });
              this.source.load(this.shipmentHistoryData);
            }
          },
          (error) => {
            this.isLoading = false;
            if (error && error.error.errors && error.error.errors.failed) {
              this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
          }
        )
      );
    }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  public onViewShipNowDetails(event:any):void {
    this.router.navigate([`/pages/shipments/shipments-history-details`], { queryParams: {book_id : event.data.shipment_booking_id}});
  }
}
