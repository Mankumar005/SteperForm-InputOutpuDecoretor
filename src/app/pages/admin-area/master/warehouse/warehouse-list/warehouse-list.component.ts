import { Component, OnDestroy, OnInit } from "@angular/core";
import { SmartTableData } from "../../../../../@core/data/smart-table";
import { Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { LocalDataSource } from "ng2-smart-table";
import { WareHouseService } from "../../../../../shared/component-services/admin-area.services.ts/warehouse.service";
import { WareHouseRenderComponent } from "../render-component/warehouse-edit-view-button";
import { UtilService } from "../../../../../shared/common- services/util.service";

@Component({
  selector: "ngx-warehouse-list",
  templateUrl: "./warehouse-list.component.html",
  styleUrls: ["./warehouse-list.component.scss"],
})
export class WarehouseListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public warehouseList: Array<any> = [];
  public isLoading: boolean = false;
  public userDetails: any;

  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount: any;
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
    pager: {
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
        },
      },
      address1: {
        title: "Address",
        type: "string",
      },
      city: {
        title: "City",
        type: "string",
      },
      country: {
        title: "Country",
        type: "string",
      },
      state: {
        title: "State",
        type: "string",
      },
      zip_code: {
        title: "Zip Code",
        type: "string",
      },
      action:{
        title: 'Action',
        type: 'custom',
        filter:false,
        sort: false,
        position: 'right',
        renderComponent: WareHouseRenderComponent
      }
    }
  };

  constructor(
    public service: SmartTableData,
    public warehousService: WareHouseService,
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
                      if(childInChildMenu.menu_code === 'WAREHOUSE_LIST') {
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
          this.getWarehouseList();
        }
      })
  }

  ngOnInit(): void {
    this.getWarehouseList();
  }

  public getWarehouseList() {
    this.isLoading = true;
    this.subscription.push(
      this.warehousService.getWarehouseList().subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            element.address2 = (element.address2) ? element.address2 : '';
            element.zip_code = (element.zip_code) ? element.zip_code : '';
          });
          this.warehouseList = res.data;
          // console.log(res.data,'this.warehouseList====');
          this.warehouseList.forEach((element: any) => {
            element.country = element.country.country_name;
            element.state = element.state.state_name;
          });
          this.isLoading = false;
          this.source.load(this.warehouseList);
          this.totalCount = res.with.total;
        },
        (error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
            this.warehouseList = [];
            this.source.load(this.warehouseList);
          }
        }
      )
    );
  }

  public onEditWarehouse(event: any): void {
    this.router.navigate([`/pages/admin-area/master/add-edit-warehouse`], {queryParams: { vayu_logi_location_id: btoa(event.data.vayu_logi_location_id)}});
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
