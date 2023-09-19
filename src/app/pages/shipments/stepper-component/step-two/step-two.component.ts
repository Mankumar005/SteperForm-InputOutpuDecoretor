import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ShipmentNowService } from '../../../../shared/component-services/shipment-now.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { DialogNamePromptComponent } from '../../dialog-name-prompt/dialog-name-prompt.component';
import { Subscription } from 'rxjs';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {
  public bookShipmentSecondForm: UntypedFormGroup;
  public selectedSecondStepCountryId: any;
  public selectedSecondStepStateId: any;
  public recipientAddressBookData: Array<any> = [];
  public secondStepStateData: Array<any> = [];
  public countryData: Array<any> = [];
  public stateData: Array<any> = [];
  public subscription: Subscription[] = [];
  public isLoading: boolean = false;

  @Input() public shipmentDetail: any = null;
  @Input() public shipmentBookingId: any = null;
  @Input() public allFormFieldsDisabled: boolean = false;
  @Input() public firstStepShipmentBookingId: any = null;
  @Input() public jazvaOrderId: any = null;
  @Input() public secondStepShipmentBookingRecipientId: any = null;
  @Input() public secondStepCustomerRecipientAddressId: any = null;
  @Output() stepperTriggerEmitter: EventEmitter<any> = new EventEmitter();
  @Output() isFormValidCheckEmitter: EventEmitter<boolean> = new EventEmitter(false);

  public SecondFormFormValidations: any = {
    country_id: [{ type: 'required', message: ' Country Name is required' }],
    company_name: [{ type: 'required', message: ' Company Name is required' }],
    contact_name: [{ type: 'required', message: 'Contact Name is required' }],
    address1: [{ type: 'required', message: ' Address is required' }],
    zip_code: [
      { type: "required", message: " Zip Code is required" },
      { type: "minLength", message: " Zip requied atleast 5 characters." },
    ],
    state_id: [{ type: "required", message: " State Name is required" }],
    city: [{ type: "required", message: " City Name is required" }],
    phone: [{ type: "required", message: " Phone No is required" }],
  };
  
  constructor(
    private fb: UntypedFormBuilder,
    public utilService: UtilService,
    public shipmentNowService: ShipmentNowService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router
  ) {
    // this.getCountry();
    // this.getRecipientAddressBook();
  }

  ngOnInit(): void {
    this.getCountry();
    this.getRecipientAddressBook();
    this.bookShipmentSecondForm = this.fb.group({
      shipment_booking_id: [0],
      shipment_booking_recipient_id: [0],
      country_id: ["", Validators.required],
      country_iso_code: ["US"],
      country_code: ["", Validators.required],
      company_name: ["", Validators.required],
      contact_name: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(this.utilService._emialRegExp),
        ],
      ],
      address1: ["", Validators.required],
      address2: [""],
      zip_code: [
        "",
        [
          Validators.required,
          Validators.maxLength(20)
        ],
      ],
      state_id: ["", Validators.required],
      city: ["", Validators.required],
      phone: ["", Validators.required],
      phone_extension: [""],
      is_residential_address: [false],
      is_recipient_save_address: [false],
      customer_recipient_address_id: [0],
    });

    if(this.shipmentBookingId) {
      if(this.shipmentDetail) {
        this.secondStepShipmentBookingRecipientId = this.shipmentDetail.shipment_booking_recipient_id;
        this.setValueSecondForm(this.shipmentDetail);
        if(this.allFormFieldsDisabled) {
          this.bookShipmentSecondForm.get('is_residential_address').disable();
          this.bookShipmentSecondForm.get('is_recipient_save_address').disable();
        }
      }
    }

    this.bookShipmentSecondForm.valueChanges.subscribe((res: any) => {
      if(this.bookShipmentSecondForm.invalid) {
        this.isFormValidCheckEmitter.next(true);
      }
    })
  }

  getCountry() {
    this.subscription.push(
      this.shipmentNowService.getCountryData().subscribe(
        (res: any) => {
          this.countryData = res.data;
          if(this.shipmentBookingId) {
            this.setValueSecondForm(this.shipmentDetail);
          }
        },
        (error) => { }
      )
    );
  }

  getState(countryId?: any) {
    this.subscription.push(
      this.shipmentNowService.getStateData(countryId).subscribe(
        (res: any) => {
          this.stateData = res.data;
        },
        (error) => { }
      )
    );
  }

  getRecipientAddressBook() {
    this.subscription.push(
      this.shipmentNowService.getRecipientAddressBookData().subscribe(
        (res: any) => {
          this.recipientAddressBookData = res.data;
        },
        (error) => { }
      )
    );
  }

  openRecipientAddressSelectionDialog() {
    this.dialogService
      .open(DialogNamePromptComponent, {
        context: {
          step: 2,
          addressArray: this.recipientAddressBookData,
        },
      })
      .onClose.subscribe((returnedObj) => {
        if (returnedObj) {
          this.setValueSecondForm(returnedObj);
        }
      });
  }

  selectSecondStepCountry(event: any) {
    if (event) {
      this.secondStepStateData = [];
      this.bookShipmentSecondForm.get("state_id").setValue(null);
      this.getState(event.country_id);
      this.bookShipmentSecondForm
        .get("country_iso_code")
        .setValue(event.country_iso_code);
      this.bookShipmentSecondForm
        .get("country_code")
        .setValue(event.country_code);
    } else {
      this.secondStepStateData = [];
      this.bookShipmentSecondForm.get("state_id").setValue(null);
      this.bookShipmentSecondForm.get("country_iso_code").setValue("US");
      this.bookShipmentSecondForm.get("country_code").setValue("");
    }
  }

  setValueSecondForm(obj: any) {
    this.bookShipmentSecondForm.get("company_name").setValue(obj.company_name);
    this.bookShipmentSecondForm.get("contact_name").setValue(obj.contact_name);
    this.bookShipmentSecondForm.get("email").setValue(obj.email);
    this.bookShipmentSecondForm.get("address1").setValue(obj.address1);
    this.bookShipmentSecondForm.get("address2").setValue(obj.address2);
    this.bookShipmentSecondForm.get("country_id").setValue(obj.country_id);
    this.getState(obj.country_id);
    this.bookShipmentSecondForm.get("country_code").setValue(obj.country_code);
    this.bookShipmentSecondForm.get("phone").setValue(obj.phone);
    this.bookShipmentSecondForm
      .get("phone_extension")
      .setValue(obj.phone_extension);
    this.bookShipmentSecondForm.get("zip_code").setValue(obj.zip_code);
    this.bookShipmentSecondForm.get("state_id").setValue(obj.state_id);
    this.bookShipmentSecondForm.get("city").setValue(obj.city);
    this.bookShipmentSecondForm
      .get("is_residential_address")
      .setValue(obj.is_residential_address ? true : false);
    this.bookShipmentSecondForm.get("is_recipient_save_address").setValue(obj.is_recipient_save_address ? true : false);
    this.secondStepCustomerRecipientAddressId = obj.customer_recipient_address_id;
  }

  saveSecondStep() {
    this.bookShipmentSecondForm.markAllAsTouched();
    this.bookShipmentSecondForm.updateValueAndValidity();
    if (this.bookShipmentSecondForm.invalid) {
      return;
    }
    this.isLoading = true;
    let payload: any = this.bookShipmentSecondForm.value;
    payload.shipment_booking_id = this.firstStepShipmentBookingId;
    payload.shipment_booking_recipient_id = this.secondStepShipmentBookingRecipientId;
    payload.is_residential_address = payload.is_residential_address === true ? 1 : 0;
    payload.is_recipient_save_address = payload.is_recipient_save_address === true ? 1 : 0;
    payload.customer_recipient_address_id =
      this.secondStepCustomerRecipientAddressId;
    if(this.jazvaOrderId) {
      payload.jazva_order_id = this.jazvaOrderId;
    }
    const fd: any = this.utilService.genrateFormData(payload);
    this.shipmentNowService.addUpdateShipNowSecondStep(fd).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          this.secondStepShipmentBookingRecipientId = res.data.shipment_booking_recipient_id;
          if (this.secondStepCustomerRecipientAddressId) {
            this.secondStepCustomerRecipientAddressId = this.secondStepCustomerRecipientAddressId;
          } else {
            this.secondStepCustomerRecipientAddressId = res.data.customer_recipient_address_id;
          }
          this.getRecipientAddressBook();
          this.stepperTriggerEmitter.emit(res);
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
