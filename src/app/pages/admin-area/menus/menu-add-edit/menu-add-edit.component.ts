import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuService } from '../../../../shared/component-services/admin-area.services.ts/menu.services';

@Component({
  selector: 'ngx-menu-add-edit',
  templateUrl: './menu-add-edit.component.html',
  styleUrls: ['./menu-add-edit.component.scss']
})
export class MenuAddEditComponent implements OnInit {
  addEditMenuForm: FormGroup;
  public isLoading: boolean = false;
  public menuId: any = null;
  public subscription: Subscription[] = [];
  public menuName = null;
  public menuType = null;
  public selectedMenuData: any = null;
  public editMenuObj: any = null;

  public formValidations: any = {
    menu_name: [{ type: "required", message: "Menu Name is required" }],
    url: [{ type: "required", message: "URL is required" }]
  };
  constructor(
    private fb: FormBuilder,
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
    public menuService: MenuService
    ) { 
      this.route.queryParams.subscribe((params: any) => {
        if(params) {
          this.menuName = params.menu_name;
          this.menuType = params.menu_type;
          this.selectedMenuData = JSON.parse(localStorage.getItem('parentMenuDetail'));
          if(params.menu_id) {
            this.menuId = atob(params.menu_id);
            this.editMenuObj = JSON.parse(localStorage.getItem('selctedEditMenuDetail'));
            this.menuName = this.editMenuObj.parent_menu_name;
          }
        } else {
          localStorage.removeItem("parentMenuDetail");
          localStorage.removeItem("selctedEditMenuDetail");
        }
      })
    }

  ngOnInit(): void {
    this.addEditMenuForm = this.fb.group({
      menu_id: [this.menuId ? this.menuId : 0, Validators.required],
      parent_id: [(this.menuId && this.editMenuObj.isChildMenu) ? this.editMenuObj.parent_id : 0],
      menu_name: [this.menuId ? this.editMenuObj.menu_name : null, Validators.required],
      url: [this.menuId ? this.editMenuObj.url : null, Validators.required],
      icon_css_class: [this.menuId ? this.editMenuObj.icon_css_class : null],
      is_only_for_admin: [(this.menuId && this.editMenuObj.is_only_for_admin===1) ? true : false]
    });
    if(this.selectedMenuData && this.selectedMenuData.menu_id && !this.menuId) {
      this.addEditMenuForm.get('parent_id').setValue(this.selectedMenuData.menu_id);
    }
  }

  public onSubmit() {
    this.isLoading = true;
    this.addEditMenuForm.markAllAsTouched();
    if (this.addEditMenuForm.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj = this.addEditMenuForm.value;
    this.subscription.push(
      this.menuService.onSaveMenuData(payloadObj).subscribe(
        (res: any) => {
          this.toastrService.success(res.message, "Success");
          this.isLoading = false;
          localStorage.removeItem("parentMenuDetail");
          localStorage.removeItem("selctedEditMenuDetail");
          this.router.navigate(["pages/admin-area/menu/menu-list"]);
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

  public back() {
    this.router.navigate(["pages/admin-area/menu/menu-list"]);
  }

}
