import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { Router } from '@angular/router';
import { ContactUsService } from '../../../../shared/component-services/admin-area.services.ts/contact-us.service';
import { ContectUsRenderComponent } from '../render-component/contact-us-edit-view-button';
import * as moment from 'moment';
 
@Component({
  selector: 'ngx-contact-us-list',
  templateUrl: './contact-us-list.component.html',
  styleUrls: ['./contact-us-list.component.scss']
})
export class ContactUsListComponent implements OnInit,OnDestroy {
  public subscription: Subscription[] = [];

  public contactList: Array <any> = []

  public contactUsId:any = null;
  
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
        phone: {
          title: 'Phone',
          type: 'string',
        },
        email: {
          title: 'Email',
          type: 'string',
        },
        created_at: {
          title: 'Date',
          type: 'string',
          filter:false,
          sort: false,
        },
        action:{
          title: 'Action',
          type: 'custom',
          filter:false,
          sort: false,
          position: 'right',
          renderComponent: ContectUsRenderComponent
        }
      }
    };
  
    constructor(public service: SmartTableData,
                public contactUsService: ContactUsService,
                public router : Router,
                private toastrService: NbToastrService,) {
           
    }
   
    ngOnInit(): void {
      this.getContactList()
    }
 

  public getContactList(){
      this.isLoading = true;
      this.subscription.push(this.contactUsService.getContactUsList().subscribe((res:any)=>{
          this.contactList = res.data
          // console.log(res.data,'this.contactList====');
          this.contactList.forEach((element:any)=>{
            element.name = element?.first_name + ' ' + element?.last_name
            element.created_at = moment.utc(element.created_at).local().format("DD-MM-YYYY hh:mm A");
          })
          this.isLoading = false;
           this.source.load(this.contactList);
           this.totalCount = res.with.total
      },error => {
        this.isLoading = false;
        if(error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0],'Error');
          this.contactList = [];
          this.source.load(this.contactList);
        }
      })
  )}
  
// public onViewContactDetails(event:any):void {
//     this.router.navigate([`/pages/admin-area/contact-us/contact-us-detail`], { queryParams: {contact_us_id : btoa(event.data.contact_us_id)}});
//   }
public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}    

}
