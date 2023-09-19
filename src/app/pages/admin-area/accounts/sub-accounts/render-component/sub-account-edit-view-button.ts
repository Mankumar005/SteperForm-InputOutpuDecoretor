import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HsnCodeService } from '../../../../../shared/component-services/admin-area.services.ts/hsn-code.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ConfirmModalComponent } from '../../../../../shared/modal-services/confirm-modal/confirm-modal.component';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../../shared/common- services/util.service';

@Component({
  selector: 'ngx-account-view',
  template: `
         <i nbTooltip="Edit" nbTooltipPlacement="bottom" class="edit-icon pointer nb-edit" (click)="onEditHSNCode(rowData)"></i>
         <nb-icon class="nb-view pointer view-icon" nbTooltip="View" nbTooltipPlacement="bottom" icon="eye-outline" (click)="onViewSubAccountDetails(rowData)"></nb-icon>
         
  `,
})
export class SubAccountsRenderComponent {
  @Input() rowData: any;

  constructor(  
    public hsnCodeService: HsnCodeService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    public router: Router,
    public utilService: UtilService
    ) {  }

public onEditHSNCode(event:any):void {
    this.router.navigate([`pages/admin-area/accounts/add-edit-sub-account`], { queryParams: {user_id : btoa(event.user_id), parent_id :  btoa(event.parent_id)}});
  }
 
public onViewSubAccountDetails(event:any):void {
  this.router.navigate([`pages/admin-area/accounts/sub-account-details`], { queryParams: {user_id : btoa(event.user_id), parent_id :  btoa(event.parent_id), account_type : 'sub-account'}});
}

}