import { Component, OnDestroy, OnInit } from "@angular/core";
import { SmartTableData } from "../../../../../@core/data/smart-table";
import { Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { HsnCodeService } from "../../../../../shared/component-services/admin-area.services.ts/hsn-code.service";
import { Subscription } from "rxjs";
import { LocalDataSource } from "ng2-smart-table";
import { ConfirmModalComponent } from "../../../../../shared/modal-services/confirm-modal/confirm-modal.component";
import { HSNCodeRenderComponent } from "../render-component/hsn-code-edit-view-button";
import { UtilService } from "../../../../../shared/common- services/util.service";
 
@Component({
  selector: "ngx-hsn-code-list",
  templateUrl: "./hsn-code-list.component.html",
  styleUrls: ["./hsn-code-list.component.scss"],
})
export class HsnCodeListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];

  public hsnCodeList: Array<any> = [];

  public isLoading: boolean = false;

  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount: any;
  public userDetails: any;
  public shipmentMenuPermission: any;
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
      description: {
        title: "HSN Name",
        type: "string",
      },
      material: {
        title: "Material",
        type: "string",
      },
      gender: {
        title: "Gender",
        type: "string",
      },
      action:{
        title: 'Action',
        type: 'custom',
        filter:false,
        sort: false,
        position: 'right',
        renderComponent: HSNCodeRenderComponent
      }
    }
  };

  constructor(
    public service: SmartTableData,
    public hsnCodeService: HsnCodeService,
    public router: Router,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
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
                      if(childInChildMenu.menu_code === 'HSN_CODE_LIST') {
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
        this.getHsnCodetList();
      }
    })
  }

  ngOnInit(): void {
    this.getHsnCodetList();
  }
  public getHsnCodetList() {
    this.isLoading = true;
    this.subscription.push(
      this.hsnCodeService.getHSNCodeList().subscribe(
        (res: any) => {
          res.data.forEach((element: any) => {
            element.material = (element.material) ? element.material : '';
            element.gender = (element.gender) ? element.gender : '';
          });
          this.hsnCodeList = res.data;
          // console.log(res.data,'this.hsnCodeList====');
          this.isLoading = false;
          this.source.load(this.hsnCodeList);
          this.totalCount = res.with.total;
        },
        (error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
            this.hsnCodeList = [];
            this.source.load(this.hsnCodeList);
          }
        }
      )
    );
  }

  public onDeleteConfirm(event: any): void {
    this.dialogService
      .open(ConfirmModalComponent, {
        context: {
          data: "Are you sure want to delete?",
        },
      })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          // event.confirm.resolve(event.newData);
          this.subscription.push(this.hsnCodeService.onDeleteHSNCode(event.data.harmonized_system_code_id).subscribe(
                (res: any) => {
                  this.toastrService.success(res.message, "Success");
                  this.getHsnCodetList()
                },
                (error) => {
                  if (  error &&  error.error.errors &&error.error.errors.failed
                  ) {
                    this.toastrService.danger(  error.error.errors.failed[0],"Error" );
                  }
                }
              )
          );
        }
      });
  }

  public onAddEditHSNCode(event: any): void {
    this.router.navigate([`/pages/admin-area/master/add-edit-hsn-code`], {queryParams: { hsn_code_id: btoa(event.data.harmonized_system_code_id) },});
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
