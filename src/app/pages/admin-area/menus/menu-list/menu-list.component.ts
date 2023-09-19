import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../shared/component-services/admin-area.services.ts/menu.services';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../../shared/modal-services/confirm-modal/confirm-modal.component';
import { FormControl } from '@angular/forms';
import { UtilService } from '../../../../shared/common- services/util.service';

@Component({
  selector: 'ngx-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {
  public subscription: Subscription[] = [];
  seachMenuName:any = new FormControl("");
  public menusList: Array<any> = [];
  public isLoading: boolean = false;
  public total: number = 0;
  public pageNumber: number;
  public searchText: string = '';
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount:any;
  public sortMenuArray: any;
  public sortMainMenuArray: any;
  public userDetails: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  constructor(
    public menuService: MenuService,
    private dialogService: NbDialogService,
    public router: Router,
    public utilService: UtilService,
    private toastrService: NbToastrService
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
                      if(childInChildMenu.menu_code === 'MENU_LIST') {
                        if(childMenuPermission?.permissions?.length) {
                          childMenuPermission.permissions.forEach((childMenu: any) => {
                            if(childMenu.permission_slug === 'CREATE') {
                              this.onPermission.create = true;
                            }
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

  ngOnInit(): void {
    localStorage.removeItem("parentMenuDetail");
    localStorage.removeItem("selctedEditMenuDetail");
    this.getAllMenus(this.pageNumber, undefined, undefined, null);
  }

  public onSearchMenuName(searchStr: any) {
    let strSearchValue: any = searchStr.target.value;
    if(strSearchValue?.length > 2) {
      this.getAllMenus(1, undefined, undefined, strSearchValue);
    }
    if(!strSearchValue?.length) {
      this.getAllMenus(1, 'ASC', 'display_order', null);
    }
  }

  getAllMenus(pageNo: number = this.currentPage, sort: string = 'ASC',
  order_by: string = 'display_order', search?: string) {
    this.isLoading = true;
    this.menusList = [];
        const data: any = {
            per_page: 100,
            page_no: pageNo,
            sort,
            order_by,
            parent_id: 0
        }
        if (search) {
            data.search = search;
        }
      this.subscription.push(
        this.menuService.getMenuData(data).subscribe(
          (res: any) => {
            this.menusList = res.data;
            this.sortMainMenuArray = res.results;
            this.menusList.map((val: any, index: number) => {
                val.children = val.children_menus;
                val.sr_no = index + 1; // val.sequence;
                if (val.children_menus && val.children_menus.length) {
                    this.recursiveMenuLoop(val, 0);
                }
            })
            this.total = res.with.total;
            this.isLoading = false;
          }, (err: any) => {

          }))
        }

        public recursiveMenuLoop(mainMenu, menuLevel) {
          let colors = ["lightgrey", "#c1bbbb", "#989696", "#7d7979", "#926565", "#6e9265"];
          let menuColor = colors[menuLevel];
          mainMenu.children_menus.map((val: any, index: number) => {
              val.color = menuColor;
              val.isChildMenu = true;
              val.parent_id = mainMenu.menu_id;
              val.parent_menu_name = mainMenu.menu_name;
              val.children = val.children_menus;
              val.sr_no = mainMenu.sr_no + '.' + (index + 1); // val.sequence;
              if (val.children_menus && val.children_menus.length) {
                  this.recursiveMenuLoop(val, (menuLevel + 1));
              }
          });
      }

  public addSubMenu(menuObj: any) {
    localStorage.setItem('parentMenuDetail', JSON.stringify(menuObj));
    this.router.navigate([`/pages/admin-area/menu/add`], { queryParams: {menu_name: menuObj.menu_name, menu_type : 'subMenu'}});
  }

  public editMenuModal(menuObj: any) {
    localStorage.setItem('selctedEditMenuDetail', JSON.stringify(menuObj));
    this.router.navigate([`/pages/admin-area/menu/edit`], { queryParams: {menu_id: btoa(menuObj.menu_id)}});
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
          this.subscription.push(this.menuService.onDeleteMenu(event.menu_id).subscribe(
            (res: any) => {
              this.toastrService.success(res.message, "Success");
              this.getAllMenus(1, 'ASC', 'menu_id', null);
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

}
