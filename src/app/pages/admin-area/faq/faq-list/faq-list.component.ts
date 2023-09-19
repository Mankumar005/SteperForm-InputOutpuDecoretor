import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { FAQService } from '../../../../shared/component-services/admin-area.services.ts/faq.service';
import { HelpDeskService } from '../../../../shared/component-services/help-desk.service';
import { UtilService } from '../../../../shared/common- services/util.service';

@Component({
  selector: 'ngx-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public faqList: Array<any> = [];
  public isLoading: boolean = false;
  public userDetails: any;
  public onPermission : any = {
    access : false,
    create  :  false,
    update : false,
    view : false,
    delete : false,
  }

  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount: any;


  constructor(public service: SmartTableData,
    public faqervice: FAQService,
    public helpDeskService: HelpDeskService,
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
                if (childMenuPermission.menu_code === 'FAQ') {
                  if (childMenuPermission.children_menus && childMenuPermission.children_menus.length) {
                    childMenuPermission.children_menus.forEach((childInChildMenu: any) => {
                      if(childInChildMenu.menu_code === 'FAQ_LIST') {
                        if(childMenuPermission?.permissions?.length) {
                          childMenuPermission.permissions.forEach((childMenu: any) => {
                            if(childMenu.permission_slug === 'CREATE') {
                              this.onPermission.create = true;
                            }
                            if(childMenu.permission_slug === 'UPDATE') {
                              this.onPermission.update = true;
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
    this.getFAQList()
  }

  public getFAQList() {
    this.isLoading = true;
    this.subscription.push(this.faqervice.getFAQData().subscribe((res: any) => {
      this.faqList = res.data
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    })
    )
  }

  public redirectAddEditFAQ(event: any): void {
    if (event.faq_id) {
      this.router.navigate([`/pages/admin-area/faq/add-edit-faq`], { queryParams: { faq_id: btoa(event.faq_id) } });
    } else if (event == 'null') {
      this.router.navigate([`/pages/admin-area/faq/add-edit-faq`], { queryParams: { add_faq: 0 } });
    }
  }

  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }

}
