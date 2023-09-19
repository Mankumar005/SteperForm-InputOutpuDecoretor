import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup,Validators,} from "@angular/forms";
import { UtilService } from "../../../shared/common- services/util.service";
import { NbDateService, NbDialogService, NbToastrService,} from "@nebular/theme";
import { Subscription } from "rxjs";
import { ShipmentNowService } from "../../../shared/component-services/shipment-now.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "ngx-book-shipments",
  templateUrl: "./book-shipments.component.html",
  styleUrls: ["./book-shipments.component.scss"],
})
export class BookShipmentsComponent implements OnInit, OnDestroy {
  @ViewChild('stepper')stepper;

  public bookShipmentFirstForm: UntypedFormGroup;
  public bookShipmentSecondForm: UntypedFormGroup;
  public bookShipmentThirdForm: UntypedFormGroup;
  public bookShipmentFourForm: UntypedFormGroup;
  public bookShipmentFiveForm: UntypedFormGroup;
  public bookShipmentSixForm: UntypedFormGroup;
  public bookShipmentSevenForm: UntypedFormGroup;
  public subscription: Subscription[] = [];
  public firstStepShipmentBookingId: any = 0;
  public secondStepCustomerRecipientAddressId: any = 0;
  public secondStepShipmentBookingRecipientId: any = 0;
  public firstStepShipmentBookingSenderId: any = 0;
  public firstStepCustomerSenderAddressId: any = 0;
  public thirdStepShipmentBookingPackageId: any = 0;
  public fourthStepShipmentBillingPrefrenceId: any = 0;
  public fourthStepPickupAddressBookId: any = 0;
  public shipmentBookingId: any = null;
  public jazvaResponse: any = null;
  public jazvaOrderId: any = null;
  public allFormFieldsDisabled: boolean = false;
  public shipmentBookingSenderDetail: any = null;
  public shipmentBookingRecipientDetail: any = null;
  public shipmentBookingPackageDetail: any = null;
  public shipmentBillingPrefrence: any = null;
  public shipmentBookingCommodity: any = null;
  public termsCondistionData: any = null;
  public selectedShipmentDate: any = null;
  public isApiLoading: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    public utilService: UtilService,
    public shipmentNowService: ShipmentNowService,
    private toastrService: NbToastrService,
    private router: Router,
    public route: ActivatedRoute,
    protected dateService: NbDateService<Date>
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if(params.shipment_booking_id) {
        this.shipmentBookingId = atob(params.shipment_booking_id);
      }
    });
    if (this.shipmentBookingId) {
      this.firstStepShipmentBookingId = this.shipmentBookingId;
      this.getShipmentData(this.shipmentBookingId);
    }
  }

  ngOnInit() {
    this.bookShipmentFirstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });

    this.bookShipmentSecondForm = this.fb.group({
      secondCtrl: ['', Validators.required],
    });

    this.bookShipmentThirdForm = this.fb.group({
      thirdStepCtrl: ['', Validators.required],
    });

    this.bookShipmentFourForm = this.fb.group({
      fourthStepCtrl: ['', Validators.required],
    });

    this.bookShipmentFiveForm = this.fb.group({
      fifthStepCtrl: ['', Validators.required],
    });
  }

  public getShipmentData(id: any) {
    this.isApiLoading = true;
    this.subscription.push(
      this.shipmentNowService
        .getShipmentBookingDetailsDetailsById(id)
        .subscribe(
          (res: any) => {
            if (res && res.data) {
              this.jazvaOrderId = res.data.jazva_order_id;
              if(this.jazvaOrderId) {
                this.allFormFieldsDisabled = true;
              } else {
                this.allFormFieldsDisabled = false;
              }
              if(res.data.is_draft !== 1) {
                this.router.navigateByUrl("pages/shipments/shipments-history");
              }
              if (res.data.shipment_booking_sender) {
                this.shipmentBookingSenderDetail = res.data.shipment_booking_sender;
                this.firstStepShipmentBookingSenderId = res.data.shipment_booking_sender.shipment_booking_sender_id;
              }
              if (res.data.shipment_booking_recipient) {
                this.shipmentBookingRecipientDetail = res.data.shipment_booking_recipient;
                this.secondStepShipmentBookingRecipientId = res.data.shipment_booking_recipient.shipment_booking_recipient_id;
              }
              if (res.data.shipment_booking_package) {
                this.shipmentBookingPackageDetail = res.data;
                this.thirdStepShipmentBookingPackageId = res.data.shipment_booking_package.shipment_booking_package_id;
              }
              if (res.data.shipment_billing_prefrence) {
                this.fourthStepShipmentBillingPrefrenceId = res.data.shipment_billing_prefrence.shipment_billing_prefrence_id;
                this.shipmentBillingPrefrence = res.data;
              }
              if (res.data.shipment_booking_commodity) {
                this.shipmentBookingCommodity = res.data
              }
              this.termsCondistionData = res.data;
              this.isApiLoading = false;
            }
          },
          (error) => {
            this.isApiLoading = false;
            if (error && error.error.errors && error.error.errors.failed) {
              this.router.navigateByUrl("pages/shipments/shipments-history");
              this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
          }
        )
    );
  }

  firstStepSave(res) {
    if(res && res.data) {
      this.bookShipmentFirstForm.get('firstCtrl').setValue("abc");
      this.firstStepShipmentBookingId = res.data.shipment_booking_id;
      this.firstStepShipmentBookingSenderId = res.data.shipment_booking_sender_id;
      if (this.firstStepCustomerSenderAddressId) {
        this.firstStepCustomerSenderAddressId =
          this.firstStepCustomerSenderAddressId;
      } else {
        this.firstStepCustomerSenderAddressId = res.data.customer_sender_address_id;
      }
      this.stepper.next();
    }
  }

  isValidFirstFormCheck(isInValidForm: any) {
    if(isInValidForm) {
      this.bookShipmentFirstForm.get('firstCtrl').setValue('');
    }
  }

  secondStepSave(res: any) {
    if(res && res.data) {
      this.bookShipmentSecondForm.get('secondCtrl').setValue("abc");
      if (res && res.data) {
        this.secondStepShipmentBookingRecipientId =
          res.data.shipment_booking_recipient_id;
        if (this.secondStepCustomerRecipientAddressId) {
          this.secondStepCustomerRecipientAddressId =
            this.secondStepCustomerRecipientAddressId;
        } else {
          this.secondStepCustomerRecipientAddressId =
            res.data.customer_recipient_address_id;
        }
      }
      this.stepper.next();
    }
  }

  isValidSecondFormCheck(isInValidForm) {
    if(isInValidForm) {
      this.bookShipmentSecondForm.get('secondCtrl').setValue('');
    }
  }

  thirdStepSave(res: any) {
      if (res && res.data) {
        this.bookShipmentThirdForm.get('thirdStepCtrl').setValue("abc");
        this.selectedShipmentDate = res.data.shipment_date;
        if (res.data.shipment_booking_recipient_id) {
          this.secondStepShipmentBookingRecipientId =
            res.data.shipment_booking_recipient_id;
        }
        if (this.thirdStepShipmentBookingPackageId) {
          this.thirdStepShipmentBookingPackageId =
            this.thirdStepShipmentBookingPackageId;
        } else {
          this.thirdStepShipmentBookingPackageId =
            res.data.shipment_booking_package_id;
        }
        this.stepper.next();
      }
  }

  isValidThirdFormCheck(isInValidForm) {
    if(isInValidForm) {
      this.bookShipmentThirdForm.get('thirdStepCtrl').setValue('');
    }
  }

  fourthStepSave(res: any) {
    if(res && res.data) {
      this.bookShipmentFourForm.get('fourthStepCtrl').setValue("abc");
      if (res && res.data) {
        if (this.fourthStepShipmentBillingPrefrenceId) {
          this.fourthStepShipmentBillingPrefrenceId =
            this.fourthStepShipmentBillingPrefrenceId;
        } else {
          this.fourthStepShipmentBillingPrefrenceId =
            res.data.shipment_billing_prefrence_id;
        }

        if (this.fourthStepPickupAddressBookId) {
          this.fourthStepPickupAddressBookId =
            this.fourthStepPickupAddressBookId;
        } else {
          this.fourthStepPickupAddressBookId =
            res.data.pickup_address_book_id;
        }
      }
      this.stepper.next();
    }
  }

  isValidFourthFormCheck(isInValidForm) {
    if(isInValidForm) {
      this.bookShipmentFourForm.get('fourthStepCtrl').setValue('');
    }
  }

  fifthStepSave(res: any) {
    if(res && res.data) {
      this.bookShipmentFiveForm.get('fifthStepCtrl').setValue("abc");
      this.jazvaResponse = res.data;
      this.stepper.next()
    }
  }

  isValidFifthFormCheck(isInValidForm) {
    if(isInValidForm) {
      this.bookShipmentFiveForm.get('fifthStepCtrl').setValue('');
    }
  }

  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
