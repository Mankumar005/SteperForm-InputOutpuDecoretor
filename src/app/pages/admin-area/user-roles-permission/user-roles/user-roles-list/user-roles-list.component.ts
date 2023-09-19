import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRolesService } from '../../../../../shared/component-services/admin-area.services.ts/user-role.service';
import { SmartTableData } from '../../../../../@core/data/smart-table';
import { NbToastrService } from '@nebular/theme';
import { ContactUsService } from '../../../../../shared/component-services/admin-area.services.ts/contact-us.service';
import { LocalDataSource } from 'ng2-smart-table';
import { UserRenderComponent } from '../render-component/user-edit-delete-button';
import { UtilService } from '../../../../../shared/common- services/util.service';

@Component({
  selector: 'ngx-user-roles-list',
  templateUrl: './user-roles-list.component.html',
  styleUrls: ['./user-roles-list.component.scss']
})
export class UserRolesListComponent implements OnInit,OnDestroy  {
  public subscription: Subscription[] = [];
  
  public allUserRolesData: any = [];

  public userList: Array <any> = []
  
  public isLoading: boolean = false;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }
  
  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount:any;
  public userDetails: any;
   
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
          filter:false,
          sort: false,
          valuePrepareFunction : (val,row,cell)=>{
            const pager = this.source.getPaging();
            const ret = (pager.page-1) * pager.perPage + cell.row.index+1;
            return ret;
         },
         
        },
        name: {
          title: 'Name',
          type: 'string',
        },
        slug: {
          title: 'Slug',
          type: 'string',
        },
        action:{
          title: 'Action',
          type: 'custom',
          filter:false,
          sort: false,
          position: 'right',
          renderComponent: UserRenderComponent
        }
      }
    };
  
    constructor(
      public service: SmartTableData,
      public userRoleService: UserRolesService,
      public router : Router,
      public utilService: UtilService,
      private toastrService: NbToastrService) {

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
            this.getUserRoleList();
          }
        })
    }
   
    ngOnInit(): void {
      this.getUserRoleList()
    }
 

  public getUserRoleList(){
      this.isLoading = true;
      this.subscription.push(this.userRoleService.getUserRoleList().subscribe((res:any)=>{
          this.userList = res.data;
          this.isLoading = false;
           this.source.load(this.userList);
           this.totalCount = res.with.total
      },error => {
        this.isLoading = false;
        if(error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0],'Error');
          this.userList = [];
          this.source.load(this.userList);
        }
      })
  )}
  

public redirectToAddEditPage(data: any) {
    this.router.navigateByUrl(`/application/master/user-roles/add_user_roles?roleId=${data.role_id}`);
  }

public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
} 
}
