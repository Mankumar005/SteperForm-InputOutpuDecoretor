import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../shared/common- services/util.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ShipmentStatusService } from '../../../../shared/component-services/admin-area.services.ts/shipment-status.services';
import { ShipmentStatusRenderComponent } from '../render-component/status-edit-delete-button';

@Component({
  selector: 'ngx-shipment-status-list',
  templateUrl: './shipment-status-list.component.html',
  styleUrls: ['./shipment-status-list.component.scss']
})
export class ShipmentStatusListComponent implements OnInit {
  public subscription: Subscription[] = [];
  public shipmentStatusList: Array<any> = [];
  public isLoading: boolean = false;

  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount: any;
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
    mode: "external",
    pager:{
      display: true,
      perPage: this.showPerPage,
    },
    columns: {
      index: {
        title: "No",
        type: "string",
        filter: false,
        sort: false,
        valuePrepareFunction: (val, row, cell) => {
          const pager = this.source.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      name: {
        title: "Status Name",
        type: "string",
      },
      action:{
        title: 'Action',
        type: 'custom',
        filter:false,
        sort: false,
        position: 'right',
        renderComponent: ShipmentStatusRenderComponent
      }
    }
  };

  constructor(
    public shipmentStatusService: ShipmentStatusService,
    public router: Router,
    private toastrService: NbToastrService,
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
          }
        });
      }

    this.utilService.deleteEmmiter.subscribe((res: any) => {
      if(res) {
        this.getShipmentStatusList();
      }
    })
  }

  ngOnInit(): void {
    this.getShipmentStatusList();
  }

  public getShipmentStatusList() {
    this.isLoading = true;
    this.subscription.push(
      this.shipmentStatusService.getShipmentStatusList().subscribe(
        (res: any) => {
          this.shipmentStatusList = res.data;
          this.isLoading = false;
          this.source.load(this.shipmentStatusList);
          this.totalCount = res.with.total;
        },
        (error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
            this.shipmentStatusList = [];
            this.source.load(this.shipmentStatusList);
          }
        }
      )
    );
  }

}
