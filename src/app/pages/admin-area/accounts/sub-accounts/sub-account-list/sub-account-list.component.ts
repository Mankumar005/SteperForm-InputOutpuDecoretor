import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SmartTableData } from '../../../../../@core/data/smart-table';
import { AccountService } from '../../../../../shared/component-services/admin-area.services.ts/accounts.service';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilService } from '../../../../../shared/common- services/util.service';
import { SubAccountsRenderComponent } from '../render-component/sub-account-edit-view-button';

@Component({
  selector: 'ngx-sub-account-list',
  templateUrl: './sub-account-list.component.html',
  styleUrls: ['./sub-account-list.component.scss']
})
export class SubAccountListComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public pendingAccountList: Array <any> = [];
  public status: NbComponentStatus[] = [ 'primary'];
  public selectAccountStatus: any = 0;
  public isLoading: boolean = false;
  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount:any;
   
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
         }
        },
        name: {
          title: 'Name',
          type: 'string',
        },
        company_name: {
          title: 'Company',
          type: 'string',
        },
        phone: {
          title: 'Phone',
          type: 'string',
        },
        email: {
          title: 'Email',
          type: 'string',
        },
        country: {
          title: 'Country',
          type: 'string',
        },
        created_at: {
          title: 'Registered Date',
          type: 'string',
        },
        action:{
          title: 'Action',
          type: 'custom',
          filter:false,
          sort: false,
          position: 'right',
          renderComponent: SubAccountsRenderComponent
        }
      }
    };
  
    constructor(public service: SmartTableData,
                public accountService: AccountService,
                public utilService: UtilService,
                public router : Router,
                private toastrService: NbToastrService,) {
                // this.source.load(data);
    }
   
    ngOnInit(): void {
      this.getSubAccountList()
    }

  public getSubAccountList(){
      this.isLoading = true;
      this.subscription.push(this.accountService.getSubAccountListData().subscribe((res:any)=>{
          this.pendingAccountList = res.data
          // console.log(res.data,'this.pendingAccountList====');
          this.pendingAccountList.forEach((element:any)=>{
            element.name = element?.first_name + ' ' + element?.last_name
            element.country = element?.country?.country_name
            element.created_at = moment.utc(element?.created_at).local().format("DD-MM-YYYY hh:mm A"); 
          })
          this.isLoading = false;
           this.source.load(this.pendingAccountList);
           this.totalCount = res.with.total
      },error => {
        this.isLoading = false;
        if(error && error.error.errors && error.error.errors.failed) {
          // this.toastrService.danger(error.error.errors.failed[0],'Error');
          this.pendingAccountList = [];
          this.source.load(this.pendingAccountList);
        }
      })
  )}
  
  public addSubAccount():void {
    let approved_user_id = this.utilService.getLocalStorageValue('approved_user_id')
    this.router.navigate([`pages/admin-area/accounts/add-edit-sub-account`], { queryParams: {parent_id : btoa(approved_user_id)}});
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}    }
