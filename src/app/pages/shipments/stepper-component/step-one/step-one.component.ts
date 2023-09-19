import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ShipmentNowService } from '../../../../shared/component-services/shipment-now.service';
import { Subscription } from 'rxjs';
import { DialogNamePromptComponent } from '../../dialog-name-prompt/dialog-name-prompt.component';

@Component({
  selector: 'ngx-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {
  public bookShipmentFirstForm: UntypedFormGroup;
  public firstStepShipmentBookingId: any = 0;
  public firstStepShipmentBookingSenderId: any = 0;
  public firstStepCustomerSenderAddressId: any = 0;
  public selectedFirstStepCountryId: any;
  public selectedFirstStepStateId: any;
  public senderAddressBookData: Array<any> = [];
  public subscription: Subscription[] = [];
  public stateData: Array<any> = [];
  public countryData: Array<any> = [];
  public isLoading: boolean = false;

  @Input() public shipmentDetail: any = null;
  @Input() public shipmentBookingId: any = null;
  @Input() public jazvaOrderId: any = null;
  @Input() public allFormFieldsDisabled: boolean = false;
  @Output() stepperTriggerEmitter: EventEmitter<any> = new EventEmitter();
  @Output() isFormValidCheckEmitter: EventEmitter<boolean> = new EventEmitter(false);

  // Form Validation Required Message
  public formValidations: any = {
    country_id: [{ type: 'required', message: ' Country Name is required' }],
    company_name: [{ type: 'required', message: ' Company Name is required' }],
    contact_name: [{ type: 'required', message: 'Contact Name is required' }],
    address1: [{ type: 'required', message: ' Address is required' }],
    zip_code: [{ type: 'required', message: ' Zip Code is required' }],
    state_id: [{ type: 'required', message: ' State Name is required' }],
    city: [{ type: 'required', message: ' City Name is required' }],
    phone: [{ type: 'required', message: ' Phone No is required' }],
    email: [
      { type: "required", message: "Email is required" },
      { type: "pattern", message: "Enter valid email" },
    ],
  };

  constructor(
    private fb: UntypedFormBuilder,
    public utilService: UtilService,
    public shipmentNowService: ShipmentNowService,
    private dialogService: NbDialogService,
    private router: Router,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.bookShipmentFirstForm = this.fb.group({
      shipment_booking_id: [0],
      shipment_booking_sender_id: [0],
      country_id: [null, Validators.required],
      country_code: [],
      country_iso_code: ["US"],
      company_name: ["", Validators.required],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(this.utilService._emialRegExp),
        ],
      ],
      contact_name: ["", Validators.required],
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
      is_default_address: [false],
      is_sender_save_address: [false],
      customer_sender_address_id: [0],
    });

    this.getCountry();
    this.getSenderAddressBook();

    if (!this.shipmentBookingId) {
      this.getSaveAsDefaultAddress();
    }

    if(this.shipmentBookingId) {
      this.firstStepShipmentBookingId = this.shipmentBookingId;
      if(this.shipmentDetail) {
        this.firstStepShipmentBookingSenderId = this.shipmentDetail.shipment_booking_sender_id;
        // this.setValueFirstForm(this.shipmentDetail);
        if(this.allFormFieldsDisabled) {
          this.bookShipmentFirstForm.get('is_default_address').disable();
          this.bookShipmentFirstForm.get('is_sender_save_address').disable();
        }
      }
    }

    this.bookShipmentFirstForm.valueChanges.subscribe((res: any) => {
      if(this.bookShipmentFirstForm.invalid) {
        this.isFormValidCheckEmitter.next(true);
      }
    })
  }

  getSaveAsDefaultAddress() {
    this.subscription.push(
      this.shipmentNowService.getSaveAsDefaultAddressData().subscribe(
        (res: any) => {
          if (res && res.data) {
            this.setValueFirstForm(res.data);
          }
        },
        (error) => { }
      )
    );
  }

  openAddressSelectionDialog() {
    this.dialogService
      .open(DialogNamePromptComponent, {
        context: {
          step: 1,
          addressArray: this.senderAddressBookData,
        },
      })
      .onClose.subscribe((returnedObj) => {
        if (returnedObj) {
          this.setValueFirstForm(returnedObj);
        }
      });
  }

  setValueFirstForm(obj: any) {
    this.bookShipmentFirstForm.get("company_name").setValue(obj.company_name);
    this.bookShipmentFirstForm.get("contact_name").setValue(obj.contact_name);
    this.bookShipmentFirstForm.get("email").setValue(obj.email);
    this.bookShipmentFirstForm.get("address1").setValue(obj.address1);
    this.bookShipmentFirstForm.get("address2").setValue(obj.address2);
    this.bookShipmentFirstForm.get("country_id").setValue(obj.country_id);
    this.getState(obj.country_id);
    this.bookShipmentFirstForm.get("country_code").setValue(obj.country_code);
    this.bookShipmentFirstForm.get("phone").setValue(obj.phone);
    this.bookShipmentFirstForm
      .get("phone_extension")
      .setValue(obj.phone_extension);
    this.bookShipmentFirstForm.get("zip_code").setValue(obj.zip_code);
    this.bookShipmentFirstForm.get("state_id").setValue(obj.state_id);
    this.bookShipmentFirstForm.get("city").setValue(obj.city);
    this.bookShipmentFirstForm
      .get("is_default_address")
      .setValue(obj.is_default_address ? true : false);
    this.bookShipmentFirstForm.get("is_sender_save_address").setValue(obj.is_sender_save_address ? true : false);
    this.firstStepCustomerSenderAddressId = obj.customer_sender_address_id;
  }

  getCountry() {
    this.subscription.push(
      this.shipmentNowService.getCountryData().subscribe(
        (res: any) => {
          this.countryData = res.data;
          if(this.shipmentBookingId) {
            this.setValueFirstForm(this.shipmentDetail);
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

  getSenderAddressBook() {
    this.subscription.push(
      this.shipmentNowService.getSenderAddressBookData().subscribe(
        (res: any) => {
          this.senderAddressBookData = res.data;
        },
        (error) => { }
      )
    );
  }

  selectFirstStepCountry(event: any) {
    if (event) {
      this.stateData = [];
      this.bookShipmentFirstForm.get("state_id").setValue(null);
      this.getState(event.country_id);
      this.bookShipmentFirstForm
        .get("country_iso_code")
        .setValue(event.country_iso_code);
      this.bookShipmentFirstForm
        .get("country_code")
        .setValue(event.country_code);
    } else {
      this.stateData = [];
      this.bookShipmentFirstForm.get("state_id").setValue(null);
      this.bookShipmentFirstForm.get("country_iso_code").setValue("US");
      this.bookShipmentFirstForm.get("country_code").setValue("");
    }
  }

  saveFirstStep() {
    this.bookShipmentFirstForm.markAllAsTouched();
    this.bookShipmentFirstForm.updateValueAndValidity();
    if (this.bookShipmentFirstForm.invalid) {
      return;
    }
    this.isLoading = true;
    let payload: any = this.bookShipmentFirstForm.value;
    payload.shipment_booking_id = this.firstStepShipmentBookingId;
    payload.shipment_booking_sender_id =
      this.firstStepShipmentBookingSenderId;
    payload.is_default_address = payload.is_default_address === true ? 1 : 0;
    payload.is_sender_save_address =
      payload.is_sender_save_address === true ? 1 : 0;
    payload.customer_sender_address_id =
      this.firstStepCustomerSenderAddressId;
    if (this.jazvaOrderId) {
      payload.jazva_order_id = this.jazvaOrderId;
    }
    const fd: any = this.utilService.genrateFormData(payload);
    this.shipmentNowService.addUpdateShipNowFirstStep(fd).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          this.firstStepShipmentBookingId = res.data.shipment_booking_id;
          this.firstStepShipmentBookingSenderId = res.data.shipment_booking_sender_id;
          if (this.firstStepCustomerSenderAddressId) {
            this.firstStepCustomerSenderAddressId =
              this.firstStepCustomerSenderAddressId;
          } else {
            this.firstStepCustomerSenderAddressId = res.data.customer_sender_address_id;
          }
          this.getSenderAddressBook();
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
