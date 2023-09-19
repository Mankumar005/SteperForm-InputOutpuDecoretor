import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../shared/component-services/dashborad.service';
import { UtilService } from '../../shared/common- services/util.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public walletCurrentBalance: any = {};
  public userDetails: any = null;

  constructor (
  public dashboardService: DashboardService,
  public utilService: UtilService,
  public toastrService: NbToastrService
  ){
    this.userDetails = this.utilService.getLocalStorageValue("userDetail");
  }


  ngOnInit(): void {
    this.getCustomerBalanceData()
  }

  public getCustomerBalanceData() {
    this.subscription.push(this.dashboardService.getcustomerBalanceData(this.userDetails.user_id).subscribe((res: any) => {
      this.walletCurrentBalance = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        // this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}  
}
