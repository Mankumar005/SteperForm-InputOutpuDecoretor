import { Component, OnDestroy, OnInit } from '@angular/core';
import { HelpDeskService } from '../../../shared/component-services/help-desk.service';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit,OnDestroy  {
public subscription: Subscription[] = [];

public faqList:any = [];
 

  constructor(
    public helpDeskService: HelpDeskService,
    private toastrService: NbToastrService
  ) { }


  ngOnInit(): void {
    this.getFAQList()
  }

getFAQList(){
  this.subscription.push(this.helpDeskService.getFAQData().subscribe((res:any)=>{
    this.faqList = res.data
  },
  (error) => {
    if (error && error.error.errors && error.error.errors.failed) {
      this.toastrService.danger(error.error.errors.failed[0], "Error");
    }
    this.toastrService.danger(error.error.errors.message, "Error");
  }
))
}

public ngOnDestroy() {
  this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
} 

}
