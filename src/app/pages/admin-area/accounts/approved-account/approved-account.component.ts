import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { AccountService } from '../../../../shared/component-services/admin-area.services.ts/accounts.service';
import * as moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { AccountRenderComponent } from '../render-component/account-edit-view-button';
 
@Component({
  selector: 'ngx-approved-account',
  templateUrl: './approved-account.component.html',
  styleUrls: ['./approved-account.component.scss']
})
export class ApprovedAccountComponent  implements OnInit,OnDestroy {
  public subscription: Subscription[] = [];

  public approvedAccountList: Array <any> = []

  public status: NbComponentStatus[] = [ 'primary'];
  
  public selectAccountStatus: any = 1;

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
          renderComponent: AccountRenderComponent
        }
      }
    };
  
    constructor(public service: SmartTableData,
                public accountService: AccountService,
                public router : Router,
                private toastrService: NbToastrService,
                private jwtHelper: JwtHelperService
                ) { }
   
    ngOnInit(): void {
      localStorage.removeItem('approved_user_id')
      this.getApprovedAccountList()
    }
  
public selectedAccountType(event:any){
  this.selectAccountStatus = event
  this.getApprovedAccountList()
}

  public getApprovedAccountList(){
      this.isLoading = true;
      this.subscription.push(this.accountService.getApprovedAccountData(this.selectAccountStatus).subscribe((res:any)=>{
          this.approvedAccountList = res.data
          // console.log(res.data,'this.approvedAccountList====');
          this.approvedAccountList.forEach((element:any)=>{
            element.name = element?.first_name + ' ' + element?.last_name
            element.country = element?.country?.country_name
            element.created_at = moment.utc(element?.created_at).local().format("DD-MM-YYYY hh:mm A"); 
          })
          this.isLoading = false;
           this.source.load(this.approvedAccountList);
           this.totalCount = res.with.total
      },error => {
        this.isLoading = false;
        if(error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0],'Error');
          this.approvedAccountList = [];
          this.source.load(this.approvedAccountList);
        }
      })
  )}
  
  public onViewCustomerDetails(event:any):void {
    this.router.navigate([`/pages/admin-area/accounts/account-details`], { queryParams: {user_id : btoa(event.data.user_id) ,account_type : 'approved'}});
  }
  
public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}  
}
