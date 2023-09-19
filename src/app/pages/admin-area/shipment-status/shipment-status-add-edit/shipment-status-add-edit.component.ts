import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ShipmentStatusService } from '../../../../shared/component-services/admin-area.services.ts/shipment-status.services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-shipment-status-add-edit',
  templateUrl: './shipment-status-add-edit.component.html',
  styleUrls: ['./shipment-status-add-edit.component.scss']
})
export class ShipmentStatusAddEditComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];
  public orderStatusId: any = null;
  public orderStatusDetials: any = {};
  public isLoading: boolean = false;
  public orderStatusForm: UntypedFormGroup;

  //validators //
  public formValidations: any = {
    name: [
      { type: "required", message: "Status Name is required" },
    ]
  };



  constructor(
    public shipmentStatusService: ShipmentStatusService,
    public fb: FormBuilder,
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService
  ) { 
    this.route.queryParams.subscribe((params: any) => {
      if(params.shipment_status_id) {
        this.orderStatusId = atob(params.shipment_status_id);
      }
      if (this.orderStatusId) {
        this.getOrderStatusDataById();
      }
      // else{
      //   this.router.navigate(["pages/admin-area/master/hsn-code-list"]);
      // }
    });
  }

  ngOnInit(): void {
    this.orderStatusForm = this.fb.group({
      name: new FormControl(""),
    });
  }

  public getOrderStatusDataById() {
    this.subscription.push(
      this.shipmentStatusService.getOrderStatusDataById(this.orderStatusId).subscribe(
        (res: any) => {
          this.orderStatusDetials = res.data;
          if (this.orderStatusId) {
            this.orderStatusForm.patchValue(this.orderStatusDetials);
          }
        },
        (error) => {
          if (error && error.error.errors && error.error.errors.failed) {
            this.router.navigate(["pages/admin-area/shipment-status/shipment-status"]);
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  public onSubmit() {
    this.isLoading = true;
    this.orderStatusForm.markAllAsTouched();
    if (this.orderStatusForm.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj = this.orderStatusForm.value;
    if (this.orderStatusId) {
      payloadObj.order_status_id = this.orderStatusId;
    }
    this.subscription.push(
      this.shipmentStatusService.onSaveOrderStatusata(payloadObj).subscribe(
        (res: any) => {
          this.toastrService.success(res.message, "Success");
          this.isLoading = false;
          this.router.navigate(["pages/admin-area/shipment-status/shipment-status"]);
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
    this.router.navigate(["pages/admin-area/shipment-status/shipment-status"]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }

}
