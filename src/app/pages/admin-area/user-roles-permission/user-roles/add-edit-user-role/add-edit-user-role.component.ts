import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRolesService } from '../../../../../shared/component-services/admin-area.services.ts/user-role.service';
import { UtilService } from '../../../../../shared/common- services/util.service';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'ngx-add-edit-user-role',
  templateUrl: './add-edit-user-role.component.html',
  styleUrls: ['./add-edit-user-role.component.scss']
})
export class AddEditUserRoleComponent implements OnDestroy {
  public subscription: Subscription[] = [];
  public roleReqModel: any = {};
  public permissionList: any = [];
  public menusList: any = [];
 
  public isLoading: boolean = false;
  public isBtnLoading: boolean = false;
  public apiCallInProg: boolean = false;

  public buttonName : string = 'Add-Role';
  public Title : string = 'Add-Role';
  public addEditRoletype!: FormGroup;
  public permisson: any = [];
  public disable = [];
  public id: any;

  public formValidations = {
    role_name: [
        { type: 'required', message: ' User Role Name is required' }
    ],
};

  constructor(
    public route: ActivatedRoute,
    public userRolesService: UserRolesService,
    public router: Router,
    private toastrService: NbToastrService,
    private _fb: FormBuilder,
    private utilService: UtilService
  ) { 
    this.createAddEditRoleTypeForm();
    this.route.queryParams.subscribe((params: any) => {
        if(params.roleId) {
          this.id = atob(params.roleId);
        }
      });
    this.getPermissions(1, undefined, undefined, undefined, {});
  }

  createAddEditRoleTypeForm() {
    this.addEditRoletype = this._fb.group({
        role_id: [0],
        role_name: ['', [Validators.required]],
    });
}

  public getPermissions(pageNo: number = 1, sort_by: string = 'ASC',
  order_by: string = 'permission_id', search?: string, filters: any = {}) {
        this.permissionList = [];
        const data: any = {
            per_page: 50,
            page: pageNo,
            sort_by,
            order_by
        }

        this.userRolesService.getAllPermission(data).subscribe((res: any) => {
            this.permissionList = res.data;        
            this.permissionList.map((val: any) => {
                val.is_permitted = false;
                val.is_permission_disabled = this.id ? true : false;
                // val.is_checked = false;
                if (val.permission_slug == 'VIEW') {
                    val.is_permitted = this.id ? false : true;
                    // val.is_checked = this.id ? false : true;
                }
                return val;
            });
            this.getAllMenus(1, undefined, undefined, undefined, {});
        }, (err: any) => {
            // this.utilService.showErrorCall(err, null);
        });
    }

    /* ========================== START: Get All Menus & Recursive ==================  */
    getAllMenus(pageNo: number = 1, order_by: string = 'menu_id',
        sort_by: string = 'ASC', search?: string, filters: any = {}) {
        this.menusList = [];
        const data: any = {
            per_page: 100,
            page_no: pageNo,
            order_by,
            sort_by,
            parent_id: 0
        }

        this.isLoading = true;
        this.userRolesService.getAllMenus(data).subscribe((res: any) => {
            this.menusList = res.data;
            this.menusList.map((val: any, index: number) => {
                val.is_visible = this.id ? false : true;
                val.row_id = val.menu_id;
                val.sr_no = index + 1; // val.sequence;
                // if (!val.permissions) {
                    val.permissions = [];
                // }
                let tmpArr = _.cloneDeep(this.permissionList);
                if (tmpArr && tmpArr.length) {
                    tmpArr.map((permissionVal: any) => {
                        val.permissions.push(permissionVal);
                    });

                }
                if (val.permissions.length >= tmpArr.length) {
                    if (val.children_menus && val.children_menus.length) {
                        this.recursiveMenuLoop(val, 0);
                    }
                }
            });
            if (this.id) {
                this.getRoleDetail(this.id);
            }
            console.log("this.menusList 123", this.menusList);
            this.isLoading = false;
        }, (err: any) => {
            this.isLoading = false;
            // this.utilService.showErrorCall(err, null);
        });
    }

    public recursiveMenuLoop(mainMenu, menuLevel) {
        let colors = ["lightgrey", "#c1bbbb", "#989696", "#7d7979", "#926565", "#6e9265"];
        let menuColor = colors[menuLevel];
        mainMenu.children_menus.map((val: any, index: number) => {
            val.color = menuColor;
            val.row_id = val.menu_id;
            val.sr_no = mainMenu.sr_no + '.' + (index + 1); // val.sequence;
            // if (!val.permissions) {
                val.permissions = [];
            // }

            let tmpArr = _.cloneDeep(this.permissionList);
            if (tmpArr && tmpArr.length) {
                tmpArr.map((permissionVal: any, ind: any) => {
                    val.permissions.push(permissionVal)
                })
            }
            val.is_visible = this.id ? false : true;
            // val.is_menu_disabled = this.id ? true : false;
            if (val.permissions.length >= tmpArr.length) {
                if (val.children_menus && val.children_menus.length) {
                    this.recursiveMenuLoop(val, (menuLevel + 1));
                }
            }
        });
    }

    public getRoleDetail(id: any) {
        this.subscription.push(this.userRolesService.getRegistrationRolesDetail(id).subscribe((res: any) => {
            this.roleReqModel.row_id = res.data.role_id;
            this.roleReqModel.name = res.data.name;
            this.addEditRoletype.get('role_name').setValue(res.data.name);
            res.data.menus.map((res:any) => {
                res.permission_ids = [];
                if(res.permissions && res.permissions.length) {
                    res.permissions.forEach((element: any) => {
                        res.permission_ids.push(element.permission_id);
                    });
                }
                if(res.children_menus && res.children_menus.length) {
                    this.recursiveChildMenuPIDSLoop(res.children_menus);
                }
            })
            this.setRolePermission(res.data.menus);
            this.isLoading = false;
            /* for (var index = 0; index < this.roleReqModel.permissionTypes.length; index++) {
                this.roleReqModel.permissionTypes[index].selected = res.results[0].permissions.includes(this.roleReqModel.permissionTypes[index].value);
            } */
        }, (error: any) => {
            this.isLoading = false;
            if (error && error.error.errors && error.error.errors.failed) {
                this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
        }));
    }

public recursiveChildMenuPIDSLoop(childMenus: any) {
    childMenus.map((childMenu:any) => {
        childMenu.permission_ids = [];
        if(childMenu.permissions && childMenu.permissions.length) {
            childMenu.permissions.forEach((element: any) => {
                childMenu.permission_ids.push(element.permission_id);
            });
        }
        if(childMenu.children_menus && childMenu.children_menus.length) {
            this.recursiveChildMenuPIDSLoop(childMenu.children_menus);
        }
    })
}    

    public setRolePermission(menus: any) {
        menus.map((roleMenu: any) => {
            this.menusList.map((masterMenu: any) => {
                if (roleMenu.menu_id === masterMenu.menu_id) {
                    masterMenu.is_visible = true;
                    if (roleMenu.permissions && roleMenu.permissions.length) {
                        masterMenu.permissions.map((masterMenuPermission: any) => {
                            if (roleMenu.permission_ids.includes(masterMenuPermission.permission_id)) {
                                masterMenuPermission.is_permitted = true;
                            }
                            masterMenuPermission.is_permission_disabled = masterMenu.is_visible ? false : true;
                        });
                    } else {
                        masterMenu.is_visible = false;
                    }

                    if (masterMenu.children_menus && masterMenu.children_menus.length) {
                        this.recursivesetRolePermission(masterMenu.children_menus, roleMenu.children_menus);
                    }
                }
            })
        })
    }

    public recursivesetRolePermission(mainMenusList: any, getMenus: any) {
        getMenus.map((roleMenu: any) => {
            mainMenusList.map((masterMenu: any) => {
                if (roleMenu.menu_id === masterMenu.menu_id) {
                    masterMenu.is_visible = true;
                    masterMenu.is_menu_disabled = false;
                    if (roleMenu.permission_ids && roleMenu.permission_ids.length) {
                        masterMenu.permissions.map((masterMenuPermission: any) => {
                            if (roleMenu.permission_ids.includes(masterMenuPermission.permission_id)) {
                                masterMenuPermission.is_permitted = true;
                            }
                            masterMenuPermission.is_permission_disabled = masterMenu.is_visible ? false : true;
                        });
                    } else {
                        masterMenu.is_visible = false;
                    }
                    if (masterMenu.children_menus && masterMenu.children_menus.length) {
                        this.recursivesetRolePermission(masterMenu.children_menus, roleMenu.children_menus);
                    }
                }
            })
        })
    }

     // Get Data For Update
     getRoleType(id: any) {
        this.buttonName = 'Update-Role';
        this.Title = 'Update-Role'

        this.subscription.push(this.userRolesService.getRoleById(id)
            .subscribe((response: any) => {
                this.addEditRoletype.patchValue({
                    role_name: response.data.role_name,
                });
                if (this.menusList) {
                    this.menusList.map((val: any) => {
                        let data = [];
                        let child: any = [];
                        if (response.data.menus) {
                            response.data.menus.map((permisionval: any) => {
                                if (val.menu_id == permisionval.menu_id) {
                                    permisionval.permissions.map((permissionID: any) => {
                                        val.permissionIDs.push(permissionID.permission_id);

                                    });
                                    if (permisionval.children_menu && val.children_menu) {
                                        val.children_menu.map((menuchild: any) => {

                                            menuchild.permissionIDs = [];

                                            permisionval.children_menu.map((PermissionChild: any) => {
                                                if (menuchild.menu_id == PermissionChild.menu_id) {
                                                    PermissionChild.permissions.map((permissionID: any) => {
                                                        menuchild.permissionIDs.push(permissionID.permission_id);
                                                    })
                                                }
                                            })

                                            child.push({ permissionIDs: menuchild.permissionIDs, menuID: menuchild.menu_id });
                                        });
                                    }
                                    // data.push()
                                    this.permisson.push({ permissionIDs: val.permissionIDs, menuID: val.menu_id, child: child });
                                }
                            });
                        }
                    });
                }
            }, (error: any) => {
                this.toastrService.danger(error.error.errors.failed[0]);
            }));
    }

    /* ========================== START: Hide-Show Menu & Recursive ==================  */
    public hideShowMenu(menuData: any, event: any) {
        var checked = event.target.checked;
        if (menuData) {
            menuData.permissions.map((permissionVal: any) => {
                if (!checked) {
                    permissionVal.is_permitted = false;
                    permissionVal.is_permission_disabled = true;
                } else {
                    permissionVal.is_permission_disabled = false;
                    if (permissionVal.permission_slug == 'VIEW') {
                        permissionVal.is_permitted = true;
                    }
                }
                return permissionVal;
            })

            if (menuData.children_menus && menuData.children_menus.length) {
                this.hideShowMenuRecursive(menuData, checked);
            }
            menuData.expand = true;
            return menuData;
        }
    }

    public hideShowMenuRecursive(menuData: any, checked: boolean) {
        menuData.children_menus.map((childMenuVal: any) => {
            if (!checked) {
                childMenuVal.is_visible = false;
                childMenuVal.is_menu_disabled = true;
            } else {
                childMenuVal.is_visible = true;
                childMenuVal.is_menu_disabled = false;
            }
            if (childMenuVal.permissions && childMenuVal.permissions.length) {
                childMenuVal.permissions.map((permissionVal: any) => {
                    if (!checked) {
                        permissionVal.is_permitted = false;
                        permissionVal.is_permission_disabled = true;
                    } else {
                        permissionVal.is_permission_disabled = false;
                        if (permissionVal.permission_slug == 'VIEW') {
                            permissionVal.is_permitted = true;
                        }
                    }
                    return permissionVal;
                })

                if (childMenuVal.children_menus && childMenuVal.children_menus.length) {
                    this.hideShowMenuRecursive(childMenuVal, checked);
                }
            }
        })
    }
    /* ========================== END: Hide-Show Menu & Recursive ==================  */

/* ========================== START: Add New Role & Recursive ==================  */

addNewRole() {
    this.addEditRoletype.markAllAsTouched();
    if(this.addEditRoletype.invalid) {
        return;
    }
    
    let menus = _.cloneDeep(this.menusList);
        menus.map((val: any) => {
            val.permission_id = [];
            if (val.permissions && val.permissions.length) {
                val.permissions.map((permissionVal: any) => {
                    if (permissionVal.is_permitted) {
                        val.permission_id.push(permissionVal.permission_id);
                    }
                })
                if (val.children_menus && val.children_menus.length) {
                    this.recursiveAddRoleLoop(val);
                }
            }
        })
        menus.forEach((element: any) => {
            delete element?.display_order;
            delete element?.icon_css_class;
            delete element?.is_active;
            delete element?.is_only_for_admin;
            delete element?.is_visible;
            delete element?.menu_code;
            delete element?.menu_name;
            delete element?.permissions;
            delete element?.row_id;
            delete element?.sr_no;
            delete element?.url;
            if(element.children_menus && element.children_menus.length) {
                this.recursiveDeleteElementLoop(element);
            }
        });
        let payload: any = {};
        payload.name = this.addEditRoletype.get('role_name').value;
        payload.role_id = (this.id) ? this.id : 0;
        payload.menu_permission = JSON.stringify(menus);
        this.subscription.push(this.userRolesService.manageRegistrationRoles(payload).subscribe((res: any) => {
            if (this.id) {
                this.toastrService.success('Role updated successfully', "Success");
            } else {
                this.toastrService.success('Role added successfully', "Success");
            }
            this.router.navigate(["pages/admin-area/user-roles/user-roles-list"]);
            this.apiCallInProg = false;
        }, (error: any) => {
            this.apiCallInProg = false;
            if (error && error.error.errors && error.error.errors.failed) {
                this.toastrService.danger(error.error.errors.failed[0], "Error");
              }
        }));
}

public recursiveAddRoleLoop(val: any) {
    val.children_menus.map((childVal: any) => {
        childVal.permission_id = [];
        if (childVal.permissions && childVal.permissions.length) {
            childVal.permissions.map((permissionVal: any) => {
                if (permissionVal.is_permitted) {
                    childVal.permission_id.push(permissionVal.permission_id);
                }
            })
        }
        if (childVal.children_menus && childVal.children_menus.length) {
            this.recursiveAddRoleLoop(childVal);
        }
    })
}

public recursiveDeleteElementLoop(val: any) {
    val.children_menus.map((childVal: any) => {
        delete childVal?.display_order;
        delete childVal?.icon_css_class;
        delete childVal?.is_active;
        delete childVal?.is_only_for_admin;
        delete childVal?.is_visible;
        delete childVal?.menu_code;
        delete childVal?.menu_name;
        delete childVal?.permissions;
        delete childVal?.row_id;
        delete childVal?.sr_no;
        delete childVal?.url;
        delete childVal?.color;
        delete childVal?.expand;

        if (childVal.children_menus && childVal.children_menus.length) {
            this.recursiveDeleteElementLoop(childVal);
        }
    })
}
/* ========================== END: Add New Role & Recursive ==================  */

public genrateFormData(form: any) {
    const fd: FormData = new FormData();
    Object.keys(form).map((key: string) => {
      let value: any = form[key];
      if (Array.isArray(value)) {
        value.map((val) => {
          fd.append(key, val);
        });
        if (!value.length) {
          fd.append(key, '[]');
        }
      } else {
        if (value != null) {
          fd.append(key, value);
        } else {
          fd.append(key, '');
        }
      }
    });
    return fd;
  }

showClid(menu: any) {
    menu.showClild = !menu.showClild;
    return menu;
}

checkPermission(permissionID: any, menuID: any, event: any, ViewID?: any) {
    const data = { permissionIDs: [permissionID], menuID, child: [] };
    const menuindex = this.permisson.findIndex((x: any) => x.menuID === menuID);
    const mindex = this.menusList.findIndex((x: any) => x.menu_id === menuID);
    this.menusList[mindex].permissionIDs = [];
    
    if (event.checked === true) {
        if (menuindex !== -1) {
            this.permisson[menuindex].permissionIDs.push(permissionID);
            this.menusList[mindex].permissionIDs = this.permisson[menuindex].permissionIDs;

        } else {
            const viewId = this.permissionList[this.permissionList.findIndex((x:any) => x.permission_name === 'View')];
            this.permisson.push(data);
            const val = this.permisson.length !== 0 ? this.permisson.length - 1 : 0;
            viewId.permission_id !== permissionID ? this.permisson[val].permissionIDs.push(viewId.permission_id) : '';
            this.menusList[mindex].permissionIDs = this.permisson[val].permissionIDs;

        }
    } else {
        const idx = this.permisson[menuindex].permissionIDs.indexOf(permissionID);
        if (ViewID != null) {
            this.menusList[mindex].permissionIDs = []
            this.permisson[menuindex] = [];
            if (this.menusList[mindex].children_menu) {
                this.menusList[mindex].children_menu.map((val: any) => {
                    val.permissionIDs = [];
                    return;
                });
            }
        } else {
            this.permisson[menuindex].permissionIDs.splice(idx, 1);
            this.menusList[mindex].permissionIDs = this.permisson[menuindex].permissionIDs;
        }
    }
}

childcheckPermission(permissionID: any, Pmenuid: any, menuId: any, event: any, ViewID?: any) {
    const data = { permissionIDs: [permissionID], menu_id: menuId };
    const menuindex = this.permisson.findIndex((x: any) => x.menuID === Pmenuid);
    const mindex = this.menusList.findIndex((x: any) => x.menu_id === Pmenuid);

    const Child = this.menusList[mindex].children_menu;
    const childmindex = Child.findIndex((x: any) => x.menu_id === menuId);
    
    const childidx = this.permisson[menuindex].child.findIndex((x: any) => x.menuID === menuId);

    if (event.checked === true) {
        if (childidx !== -1) {
            this.permisson[menuindex].child[childidx].permissionIDs.push(permissionID);
            this.menusList[mindex].children_menu[childmindex].permissionIDs = this.permisson[menuindex].child[childidx].permissionIDs;
        } else {
            const viewId = this.permissionList[this.permissionList.findIndex((x: any) => x.permission_name == 'View')];
            this.permisson[menuindex].child.push(data);
            const val = this.permisson[menuindex].child.length !== 0 ? this.permisson[menuindex].child.length - 1 : 0;
            viewId.permission_id !== permissionID ? this.permisson[menuindex].child[val].permissionIDs.push(viewId.permission_id) : '';
            this.menusList[mindex].children_menu[childmindex].permissionIDs = this.permisson[menuindex].child[val].permissionIDs;
        }
    } else {
        const idx = this.menusList[mindex].children_menu[childmindex].permissionIDs.indexOf(permissionID);
        if (ViewID != null) {
            this.menusList[mindex].children_menu[childmindex].permissionIDs = [];
            this.permisson[menuindex].child[childidx] = [];
        } else {
            this.menusList[mindex].children_menu[childmindex].permissionIDs.splice(idx, 1);
            this.menusList[mindex].children_menu[childmindex].permissionIDs = this.menusList[mindex].children_menu[childmindex].permissionIDs;
        }
    }
}

ischeckChild(menuID: any, PermissionID: any) {
    // if (menuID != null) {
        if (menuID.permissionIDs.length !== 0) {
            const index = menuID.permissionIDs.indexOf(PermissionID);
            if (index !== -1) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    // }
}

ischeck(menuID: any, PermissionID: any) {
 
    // if (menuID != null) {
        if (menuID.length !== 0) {
            const index = menuID.indexOf(PermissionID);
            if (index !== -1) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    // }
}

ngOnDestroy() {
  this.subscription.map(value => { value.unsubscribe() });
}
}
