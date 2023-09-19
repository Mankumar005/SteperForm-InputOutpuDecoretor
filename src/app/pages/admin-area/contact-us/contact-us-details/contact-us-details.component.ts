import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactUsService } from '../../../../shared/component-services/admin-area.services.ts/contact-us.service';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-contact-us-details',
  templateUrl: './contact-us-details.component.html',
  styleUrls: ['./contact-us-details.component.scss']
})
export class ContactUsDetailsComponent implements OnDestroy {
  public subscription: Subscription[] = [];
  
  public contactUsdId: any = null;

  public contcatUsDetials:any = {};

  constructor(
    public contactUsService: ContactUsService,
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.contactUsdId = atob(params.contact_us_id);      
      if (this.contactUsdId) {
        this.getContactUSDataById();
      }else{
        this.contcatUsDetials = null;
      }
    });
   }
 
public getContactUSDataById(){
  this.subscription.push(this.contactUsService.getContactUsDataId(this.contactUsdId).subscribe((res: any) => {
        this.contcatUsDetials = res.data;
        this.contcatUsDetials.name = this.contcatUsDetials.user.first_name + ' ' + this.contcatUsDetials.user.last_name
        this.contcatUsDetials.phone = this.contcatUsDetials.user.phone
        this.contcatUsDetials.email = this.contcatUsDetials.user.email
        // console.log( this.contcatUsDetials,' this.contcatUsDetials====');
    },
    (error) => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.router.navigate(["pages/admin-area/contact-us/contact-us-list"]);
        this.toastrService.danger(error.error.errors.failed[0], "Error");
      }
    }))
}
public back() {
    this.router.navigate(["pages/admin-area/contact-us/contact-us-list"]);
}
public ngOnDestroy() {
  this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}  
}
