import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-account-view',
  template: `
         <img nbTooltip="View" class="pointer" nbTooltipPlacement="bottom" src="assets/images/eye-outline.svg" width="25" height="25" (click)="onViewCustomerDetails(rowData)">
  `,
})
export class RenderViewButtonComponent {

  @Input() rowData: any;

  constructor(  
              public router: Router,
              ) { }

public onViewCustomerDetails(event:any):void {
    this.router.navigate([`/pages/accounts/account-details`], { queryParams: {user_id : event.user_id ,account_type : 'approved'}});
}
 
}
