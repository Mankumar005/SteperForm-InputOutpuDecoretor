import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UtilService } from '../../../../shared/common- services/util.service';
import { Subscription } from 'rxjs';
import { ShipmentNowService } from '../../../../shared/component-services/shipment-now.service';
import { FormControl, UntypedFormBuilder } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'ngx-step-six',
  templateUrl: './step-six.component.html',
  styleUrls: ['./step-six.component.scss']
})
export class StepSixComponent implements OnInit {
  public ternAndCondition = new FormControl(false);
  public isTermAndCondition: boolean = false;
  public userDetials: any = null;
  public walletDetails: any = null;
  public subscription: Subscription[] = [];
  public isLastSaveBtnDisabled: boolean = true;
  public isSpinnerLoader: boolean = false;
  public isLoading: boolean = false;
  public paymentTypeSelected = 1;

  @Input() public shipmentDetail: any = null;
  @Input() public shipmentBookingId: any = null;
  @Input() public allFormFieldsDisabled: boolean = false;
  @Input() public firstStepShipmentBookingId: any = null;
  @Input() public jazvaOrderResponse: any = null;
  @Input() public jazvaOrderId: any = null;
  @Input() public shipmentDate: any = null;
  @Output() stepperTriggerEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: UntypedFormBuilder,
    public utilService: UtilService,
    public shipmentNowService: ShipmentNowService,
    private dialogService: NbDialogService,
    private router: Router,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.userDetials = this.utilService.getLocalStorageValue('userDetail');
    if(this.userDetials) {
      this.getUserWalletDetails(this.userDetials.user_id);
    }

    if(this.shipmentBookingId) {
      if(this.shipmentDetail) {
        this.ternAndCondition.setValue(this.shipmentDetail.terms_condistion);
        if (this.shipmentDetail.terms_condistion === 1) {
            this.isLastSaveBtnDisabled = false;
          }
      }
    }
  }

  public getUserWalletDetails(userId: any) {
    this.subscription.push(
      this.shipmentNowService
        .getUserWalletDetailsById(userId)
        .subscribe(
          (res: any) => {
            if(res && res.data) {
              this.walletDetails = res.data;
            }
          },(error) => {
            if (error && error.error.errors && error.error.errors.failed) {
              // this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
          }))
  }

  checkTernAndCondition(event: any) {
    if (event.target.checked) {
      this.isLastSaveBtnDisabled = false;
    } else {
      this.isLastSaveBtnDisabled = true;
    }
  }

  saveSixStep(saveValue: any) {
    let date = moment(this.shipmentDate, "YYYY-mm-dd");
    let nowDate = moment(new Date(), "YYYY-mm-dd");
    if ("11:59" <= moment().format("HH:mm")) {
      if (
        moment(nowDate).format("YYYY-MM-DD") >=
        moment(date).format("YYYY-MM-DD")
      ) {
        this.toastrService.danger(
          "For same Day delivery please place order before 12:00 PM. After that, please select next day for pick up"
        );
        return;
      }
    }

    if(!this.ternAndCondition.value) {
      this.isTermAndCondition = true;
      return;
    } else {
      this.isTermAndCondition = false;
    }

    let payload: any = {};
    this.isLoading = true;
    payload.shipment_booking_id = this.firstStepShipmentBookingId;
    payload.is_draft = saveValue;
    payload.terms_condistion = this.ternAndCondition.value ? 1 : 0;
    const fd: any = this.utilService.genrateFormData(payload);
    this.shipmentNowService.addUpdateShipNowSixStep(fd).subscribe(
      (res: any) => {
        if(res && res.data) {
          this.payNow();
          // this.router.navigateByUrl("pages/shipments/shipments-history");
        }
      },
      (error) => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    );
  }

  public payNow() {
    if(this.paymentTypeSelected === 1) {
      if(parseInt(this.walletDetails && this.walletDetails.total_amount) >= parseInt(this.jazvaOrderResponse.shipment_price)) {
          let payload: any = {};
          payload.user_id = this.userDetials.user_id;
          payload.amount = this.jazvaOrderResponse.shipment_price;
          payload.amount_currency = 'INR';
          payload.transection_type = 'outward';
          payload.shipment_booking_id = this.firstStepShipmentBookingId;
          const fd: any = this.utilService.genrateFormData(payload);
          this.shipmentNowService.addPayment(fd).subscribe(
            (res: any) => {
              if(res) {
                this.isLoading = false;
                // this.toastrService.success(res.message, 'Success');
                this.saveConfirmOrder();
              }
            },
            (error) => {
              this.isLoading = false;
              if (error && error.error.errors && error.error.errors.failed) {
                this.toastrService.danger(error.error.errors.failed[0], "Error");
              }
            }
          );
        } else {
          this.isLoading = false;
          this.toastrService.danger("Insufficient balance in your wallet.", "Error");
          return;
        }
    }
  }

  saveConfirmOrder() {
    let payload: any = {};
    payload.shipment_booking_id = this.firstStepShipmentBookingId;
    payload.jazva_order_id = this.jazvaOrderResponse.jazva_order_id;
    const fd: any = this.utilService.genrateFormData(payload);
    this.shipmentNowService.confirmOrder(fd).subscribe(
      (res: any) => {
        this.toastrService.success(res.message, 'Success');
        this.router.navigateByUrl("pages/shipments/shipments-history");
      },
      (error) => {
        // this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    );
  }

  backToListPage() {
    this.dialogService
      .open(ShowcaseDialogComponent, {
        context: {
          title: "Are you sure back to shipment history list page",
          dialogName: "backToListPage"
        },
      })
      .onClose.subscribe((returnedObj) => {
        if (returnedObj) {
          this.router.navigateByUrl("pages/shipments/shipments-history");
        }
      });
  }

  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }

}
