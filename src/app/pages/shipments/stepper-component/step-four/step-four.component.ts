import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ShipmentNowService } from '../../../../shared/component-services/shipment-now.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';
import { Subscription } from 'rxjs';
import { DialogNamePromptComponent } from '../../dialog-name-prompt/dialog-name-prompt.component';

@Component({
  selector: 'ngx-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent implements OnInit {
  public bookShipmentFourForm: UntypedFormGroup;
  public recipientNotificationViaEmailSms: any;
  public senderNotificationViaEmailSms: any;
  public selectedFourthStepCountryId: any;
  public selectedFourthStepStateId: any;

  public selectedRecipientNotificationType: Array<any> = [];
  public selectedSenderNotificationType: Array<any> = [];
  public recipientNotificationTypeData: Array<any> = [];
  public SenderNotificationTypeData: Array<any> = [];
  public billTransportationToData: Array<any> = [];
  public pickupAddressBookData: Array<any> = [];
  public pickUpCountryData: Array<any> = [];
  public subscription: Subscription[] = [];
  public pickUpStateData: Array<any> = [];
  public locationData: Array<any> = [];
  public radioGroupValue = "2";
  public isLoading: boolean = false;

  @Input() public shipmentDetail: any = null;
  @Input() public shipmentBookingId: any = null;
  @Input() public jazvaOrderId: any = null;
  @Input() public allFormFieldsDisabled: boolean = false;
  @Input() public firstStepShipmentBookingId: any = null;
  @Input() public secondStepShipmentBookingRecipientId: any = null;
  @Input() public fourthStepShipmentBillingPrefrenceId: any = null;
  @Input() public fourthStepPickupAddressBookId: any = null;
  @Output() stepperTriggerEmitter: EventEmitter<any> = new EventEmitter();
  @Output() isFormValidCheckEmitter: EventEmitter<boolean> = new EventEmitter(false);

  public fourFormFormValidations: any = {
    bill_transportation_to_id: [
      { type: "required", message: "Bill Transportation To is required" },
    ],
    bill_transportation_account_no: [
      { type: "required", message: "Account No is required" },
    ],
    bill_duties_taxes_id: [
      { type: "required", message: "Bill Duties And Taxes Fees is required" },
    ],
    bill_duties_taxes_account_no: [
      { type: "required", message: "Account No is required" },
    ],
    vayu_logi_location_id: [
      { type: "required", message: "Location is required" },
    ],
    pickup_contact_name: [
      { type: "required", message: "Pickup Contact Name is required" },
    ],
    pickup_phone_no: [
      { type: "required", message: "Pickup Phone is required" },
    ],
    pickup_country_id: [
      { type: "required", message: "Pickup Country is required" },
    ],
    pickup_state_id: [
      { type: "required", message: "Pickup State is required" },
    ],
    pickup_city: [{ type: "required", message: "Pickup City is required" }],
    pickup_zip_code: [
      { type: "required", message: "Pickup Zip Code is required" },
    ],
    pickup_address_1: [
      { type: "required", message: "Pickup Address1 is required" },
    ],
    pickup_email: [
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
    private toastrService: NbToastrService
  ) {
    this.getCountry();
    this.billTransportationTo();
    this.getLocationApiCall();
    this.getpickupAddressBook();
  }

  ngOnInit(): void {
    this.bookShipmentFourForm = this.fb.group({
      shipment_billing_prefrence_id: [0],
      bill_transportation_to_id: ["1", Validators.required],
      bill_transportation_account_no: ["", Validators.required],
      bill_duties_taxes_id: ["1", Validators.required],
      bill_duties_taxes_account_no: ["", Validators.required],
      reference: [""],
      po_number: [""],
      invoice_number: [""],
      department_number: [""],
      pickup_dropoff: ["2"],
      vayu_logi_location_id: [null, Validators.required],
      pickup_country_id: [null],
      pickup_zip_code: [null],
      pickup_company_name: [null],
      pickup_email: [null],
      pickup_contact_name: [null],
      pickup_country_code: [null],
      pickup_country_iso_code: [null],
      pickup_phone_no: [null],
      pickup_phone_no_ext: [null],
      pickup_address_1: [null],
      pickup_address_2: [null],
      pickup_state_id: [null],
      pickup_city: [null],
      is_save_address: [false],
      shipment_sender_notification_type: [null],
      shipment_recipient_notification_type: [null],
      extra_notes: [null],
    });

    if(this.shipmentBookingId) {
      if(this.shipmentDetail) {
        this.fourthStepShipmentBillingPrefrenceId = this.shipmentDetail.shipment_billing_prefrence.shipment_billing_prefrence_id;
        this.setValueFourthForm(this.shipmentDetail.shipment_billing_prefrence);
        if(this.allFormFieldsDisabled) {
          this.bookShipmentFourForm.get('vayu_logi_location_id').disable();
          this.bookShipmentFourForm.get('pickup_country_id').disable();
          this.bookShipmentFourForm.get('pickup_state_id').disable();
          this.bookShipmentFourForm.get('is_save_address').disable();
        }
      }
    }

    this.bookShipmentFourForm.valueChanges.subscribe((res: any) => {
      if(this.bookShipmentFourForm.invalid) {
        this.isFormValidCheckEmitter.next(true);
      }
    })

  }

  billTransportationTo() {
    this.subscription.push(
      this.shipmentNowService.getbillTransportationToType().subscribe(
        (res: any) => {
          this.billTransportationToData = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  getLocationApiCall() {
    this.subscription.push(
      this.shipmentNowService.getLocationApi().subscribe(
        (res: any) => {
          if (res && res.data) {
            this.locationData = res.data;
          }
        },
        (error) => { }
      )
    );
  }

  getpickupAddressBook() {
    this.subscription.push(
      this.shipmentNowService.getpickupAddressBook().subscribe(
        (res: any) => {
          this.pickupAddressBookData = res.data;
        },
        (error) => { }
      )
    );
  }

  getCountry() {
    this.subscription.push(
      this.shipmentNowService.getCountryData().subscribe(
        (res: any) => {
          this.pickUpCountryData = res.data;
        },
        (error) => { }
      )
    );
  }

  selectFourthStepCountry(event: any) {
    if (event) {
      // this.firstStepStateData = [];
      this.bookShipmentFourForm.get("pickup_state_id").setValue(null);
      this.getFourthStepState(event.country_id);
      this.bookShipmentFourForm
        .get("pickup_country_iso_code")
        .setValue(event.country_iso_code);
      this.bookShipmentFourForm
        .get("pickup_country_code")
        .setValue(event.country_code);
    } else {
      // this.firstStepStateData = [];
      this.bookShipmentFourForm.get("pickup_state_id").setValue(null);
      this.bookShipmentFourForm.get("pickup_country_iso_code").setValue("US");
      this.bookShipmentFourForm.get("pickup_country_code").setValue("");
    }
  }

  billTransportationToSelect(type: any) {
    if (type === "2") {
      this.bookShipmentFourForm
        .get("bill_transportation_account_no")
        .clearValidators();
      this.bookShipmentFourForm
        .get("bill_transportation_account_no")
        .updateValueAndValidity();
    } else {
      this.bookShipmentFourForm
        .get("bill_transportation_account_no")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm
        .get("bill_transportation_account_no")
        .updateValueAndValidity();
    }
  }

  billDutiesAndTaxesFeesSelect(type: any) {
    if (type === "2") {
      this.bookShipmentFourForm
        .get("bill_duties_taxes_account_no")
        .clearValidators();
      this.bookShipmentFourForm
        .get("bill_duties_taxes_account_no")
        .updateValueAndValidity();
    } else {
      this.bookShipmentFourForm
        .get("bill_duties_taxes_account_no")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm
        .get("bill_duties_taxes_account_no")
        .updateValueAndValidity();
    }
  }

  onChangePickupDrop(event: any) {
    if (event === "1") {
      this.bookShipmentFourForm.get("vayu_logi_location_id").clearValidators();
      this.bookShipmentFourForm
        .get("vayu_logi_location_id")
        .updateValueAndValidity();
      this.bookShipmentFourForm.get("vayu_logi_location_id").markAsUntouched();

      this.bookShipmentFourForm
        .get("pickup_country_id")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm
        .get("pickup_country_id")
        .updateValueAndValidity();

      this.bookShipmentFourForm
        .get("pickup_zip_code")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm.get("pickup_zip_code").updateValueAndValidity();

      this.bookShipmentFourForm
        .get("pickup_contact_name")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm
        .get("pickup_contact_name")
        .updateValueAndValidity();

      this.bookShipmentFourForm
        .get("pickup_phone_no")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm.get("pickup_phone_no").updateValueAndValidity();

      this.bookShipmentFourForm
        .get("pickup_state_id")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm.get("pickup_state_id").updateValueAndValidity();

      this.bookShipmentFourForm
        .get("pickup_city")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm.get("pickup_city").updateValueAndValidity();

      this.bookShipmentFourForm
        .get("pickup_address_1")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm
        .get("pickup_address_1")
        .updateValueAndValidity();

      this.bookShipmentFourForm
        .get("pickup_email")
        .setValidators([
          Validators.required,
          Validators.pattern(this.utilService._emialRegExp),
        ]);
      this.bookShipmentFourForm.get("pickup_email").updateValueAndValidity();
    } else {
      this.bookShipmentFourForm.get("vayu_logi_location_id").setValue(null);
      this.bookShipmentFourForm
        .get("vayu_logi_location_id")
        .setValidators([Validators.required]);
      this.bookShipmentFourForm
        .get("vayu_logi_location_id")
        .updateValueAndValidity();
      this.bookShipmentFourForm.get("vayu_logi_location_id").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_company_name").setValue(null);
      this.bookShipmentFourForm.get("pickup_address_2").setValue(null);

      this.bookShipmentFourForm.get("pickup_country_id").setValue(null);
      this.bookShipmentFourForm.get("pickup_country_id").clearValidators();
      this.bookShipmentFourForm
        .get("pickup_country_id")
        .updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_country_id").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_zip_code").setValue(null);
      this.bookShipmentFourForm.get("pickup_zip_code").clearValidators();
      this.bookShipmentFourForm.get("pickup_zip_code").updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_zip_code").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_contact_name").setValue(null);
      this.bookShipmentFourForm.get("pickup_contact_name").clearValidators();
      this.bookShipmentFourForm
        .get("pickup_contact_name")
        .updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_contact_name").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_phone_no").setValue(null);
      this.bookShipmentFourForm.get("pickup_phone_no").clearValidators();
      this.bookShipmentFourForm.get("pickup_phone_no").updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_phone_no").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_state_id").setValue(null);
      this.bookShipmentFourForm.get("pickup_state_id").clearValidators();
      this.bookShipmentFourForm.get("pickup_state_id").updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_state_id").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_city").setValue(null);
      this.bookShipmentFourForm.get("pickup_city").clearValidators();
      this.bookShipmentFourForm.get("pickup_city").updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_city").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_address_1").setValue(null);
      this.bookShipmentFourForm.get("pickup_address_1").clearValidators();
      this.bookShipmentFourForm
        .get("pickup_address_1")
        .updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_address_1").markAsUntouched();

      this.bookShipmentFourForm.get("pickup_email").setValue(null);
      this.bookShipmentFourForm.get("pickup_email").clearValidators();
      this.bookShipmentFourForm.get("pickup_email").updateValueAndValidity();
      this.bookShipmentFourForm.get("pickup_email").markAsUntouched();
    }
  }

  openBillingAddressSelectionDialog() {
    this.dialogService
      .open(DialogNamePromptComponent, {
        context: {
          step: 4,
          addressArray: this.pickupAddressBookData,
        },
      })
      .onClose.subscribe((returnedObj) => {
        if (returnedObj) {
          this.setValueBillingForm(returnedObj);
        }
      });
  }

  setValueBillingForm(obj: any) {
    this.bookShipmentFourForm.get("pickup_country_id").setValue(obj.country_id);
    this.getFourthStepState(obj.country_id);
    this.bookShipmentFourForm.get("pickup_zip_code").setValue(obj.zip_code);
    this.bookShipmentFourForm
      .get("pickup_company_name")
      .setValue(obj.company_name);
    this.bookShipmentFourForm
      .get("pickup_contact_name")
      .setValue(obj.contact_name);
    this.bookShipmentFourForm.get("pickup_email").setValue(obj.email);
    this.bookShipmentFourForm.get("pickup_phone_no").setValue(obj.phone);
    this.bookShipmentFourForm
      .get("pickup_phone_no_ext")
      .setValue(obj.phone_extension);
    this.bookShipmentFourForm.get("pickup_address_1").setValue(obj.address1);
    this.bookShipmentFourForm.get("pickup_address_2").setValue(obj.address2);
    this.bookShipmentFourForm.get("pickup_state_id").setValue(obj.state_id);
    this.bookShipmentFourForm.get("pickup_city").setValue(obj.city);
    this.bookShipmentFourForm
      .get("is_save_address")
      .setValue(obj.is_save_address ? true : false);
  }

  getFourthStepState(countryId?: any) {
    this.subscription.push(
      this.shipmentNowService.getStateData(countryId).subscribe(
        (res: any) => {
          this.pickUpStateData = res.data;
        },
        (error) => { }
      )
    );
  }

  onChangesenderNotification(event: any, editArray?: any) {
    this.subscription.push(
      this.shipmentNowService.getShipmentNotificationType(event).subscribe(
        (res: any) => {
          if (editArray && editArray.length) {
            res.data.forEach((ele: any) => {
              ele.isChecked = false;
              editArray.forEach((element: any) => {
                if (
                  ele.shipment_notification_type_id ==
                  element.shipment_notification_type_id
                ) {
                  ele.isChecked = true;
                }
              });
            });
          } else {
            res.data.forEach((ele: any) => {
              ele.isChecked = false;
            });
          }
          this.SenderNotificationTypeData = res.data;
        },
        (error) => { }
      )
    );
  }

  onCheckSenderNotificationType(event: any, data: any) {
    if (event.target.checked) {
      this.selectedSenderNotificationType.push({
        shipment_booking_sender_id: this.firstStepShipmentBookingId,
        shipment_notification_type_id: data.shipment_notification_type_id,
      });
    } else {
      this.selectedSenderNotificationType =
        this.selectedSenderNotificationType.filter(
          (res) =>
            res.shipment_notification_type_id !== data.shipment_notification_type_id
        );
    }
  }

  onChangerecipientNotification(event: any, editArray?: any) {
    this.subscription.push(
      this.shipmentNowService.getShipmentNotificationType(event).subscribe(
        (res: any) => {
          if (editArray && editArray.length) {
            res.data.forEach((ele: any) => {
              ele.isChecked = false;
              editArray.forEach((element: any) => {
                if (
                  ele.shipment_notification_type_id ==
                  element.shipment_notification_type_id
                ) {
                  ele.isChecked = true;
                }
              });
            });
          } else {
            res.data.forEach((ele: any) => {
              ele.isChecked = false;
            });
          }
          this.recipientNotificationTypeData = res.data;
        },
        (error) => { }
      )
    );
  }

  onCheckRecipientNotificationType(event: any, data: any) {
    if (event.target.checked) {
      this.selectedRecipientNotificationType.push({
        shipment_booking_recipient_id: this.secondStepShipmentBookingRecipientId,
        shipment_notification_type_id: data.shipment_notification_type_id,
      });
    } else {
      this.selectedRecipientNotificationType =
        this.selectedRecipientNotificationType.filter(
          (res) =>
            res.shipment_notification_type_id !== data.shipment_notification_type_id
        );
    }
  }

  setValueFourthForm(obj: any) {
    this.bookShipmentFourForm
      .get("bill_transportation_to_id")
      .setValue(obj.bill_transportation_to_id.toString());
    this.billTransportationToSelect(obj.bill_transportation_to_id.toString());
    this.bookShipmentFourForm
      .get("bill_transportation_account_no")
      .setValue(obj.bill_transportation_account_no);
    this.bookShipmentFourForm
      .get("bill_duties_taxes_id")
      .setValue(obj.bill_duties_taxes_id.toString());
    this.billDutiesAndTaxesFeesSelect(obj.bill_duties_taxes_id.toString());
    this.bookShipmentFourForm
      .get("bill_duties_taxes_account_no")
      .setValue(obj.bill_duties_taxes_account_no);
    this.bookShipmentFourForm.get("reference").setValue(obj.reference);
    this.bookShipmentFourForm.get("po_number").setValue(obj.po_number);
    this.bookShipmentFourForm
      .get("invoice_number")
      .setValue(obj.invoice_number);
    this.bookShipmentFourForm
      .get("department_number")
      .setValue(obj.department_number);
    this.bookShipmentFourForm
      .get("pickup_dropoff")
      .setValue(obj.pickup_dropoff.toString());
    this.radioGroupValue = obj.pickup_dropoff.toString();
    if (obj.pickup_dropoff === 2) {
      this.onChangePickupDrop(obj.pickup_dropoff.toString());
      this.bookShipmentFourForm
        .get("vayu_logi_location_id")
        .setValue(obj.vayu_logi_location_id.toString());
    }
    if (obj.pickup_dropoff === 1) {
      this.onChangePickupDrop(obj.pickup_dropoff.toString());
      this.bookShipmentFourForm
        .get("pickup_country_id")
        .setValue(obj.pickup_country_id);
      this.selectedFourthStepCountryId = obj.pickup_country_id;
      this.getFourthStepState(obj.pickup_country_id);
      this.bookShipmentFourForm
        .get("pickup_zip_code")
        .setValue(obj.pickup_zip_code);
      this.bookShipmentFourForm
        .get("pickup_company_name")
        .setValue(obj.pickup_company_name);
      this.bookShipmentFourForm
        .get("pickup_contact_name")
        .setValue(obj.pickup_contact_name);
      this.bookShipmentFourForm.get("pickup_email").setValue(obj.pickup_email);
      this.bookShipmentFourForm
        .get("pickup_phone_no")
        .setValue(obj.pickup_phone_no);
      this.bookShipmentFourForm
        .get("pickup_phone_no_ext")
        .setValue(obj.pickup_phone_no_ext);
      this.bookShipmentFourForm
        .get("pickup_address_1")
        .setValue(obj.pickup_address_1);
      this.bookShipmentFourForm
        .get("pickup_address_2")
        .setValue(obj.pickup_address_2);
      this.bookShipmentFourForm
        .get("pickup_state_id")
        .setValue(obj.pickup_state_id);
      this.selectedFourthStepStateId = obj.pickup_state_id;
      this.bookShipmentFourForm.get("pickup_city").setValue(obj.pickup_city);
      this.bookShipmentFourForm
        .get("is_save_address")
        .setValue(obj.is_save_address ? true : false);
    }
    this.bookShipmentFourForm
      .get("shipment_sender_notification_type")
      .setValue(obj.shipment_sender_notification_type);
    this.onChangesenderNotification(
      obj.shipment_sender_notification_type,
      obj.shipment_sender_notification
    );
    if (
      obj.shipment_sender_notification &&
      obj.shipment_sender_notification.length
    ) {
      for (
        let index = 0;
        index < obj.shipment_sender_notification.length;
        index++
      ) {
        this.selectedSenderNotificationType.push({
          shipment_booking_sender_id:
            this.firstStepShipmentBookingId,
          shipment_notification_type_id:
            obj.shipment_sender_notification[index]
              .shipment_notification_type_id,
        });
      }
    }
    this.bookShipmentFourForm
      .get("shipment_recipient_notification_type")
      .setValue(obj.shipment_recipient_notification_type);
    this.onChangerecipientNotification(
      obj.shipment_recipient_notification_type,
      obj.shipment_recipient_notification
    );
    if (
      obj.shipment_recipient_notification &&
      obj.shipment_recipient_notification.length
    ) {
      for (
        let index = 0;
        index < obj.shipment_recipient_notification.length;
        index++
      ) {
        this.selectedRecipientNotificationType.push({
          shipment_booking_recipient_id:
            this.secondStepShipmentBookingRecipientId,
          shipment_notification_type_id:
            obj.shipment_recipient_notification[index]
              .shipment_notification_type_id,
        });
      }
    }
    this.bookShipmentFourForm.get("extra_notes").setValue(obj.extra_notes);
  }

  saveFourthStep() {
    this.bookShipmentFourForm.markAllAsTouched();
    this.bookShipmentFourForm.updateValueAndValidity();
    if (this.bookShipmentFourForm.invalid) {
      return;
    }
    this.isLoading = true;
    let payload: any = this.bookShipmentFourForm.value;
    payload.shipment_booking_id = this.firstStepShipmentBookingId;
    payload.shipment_billing_prefrence_id = this.fourthStepShipmentBillingPrefrenceId; // this.fourth_step_shipment_billing_prefrence_id;
    payload.is_save_address = payload.is_save_address ? 1 : 0;
    payload.pickup_address_book_id = this.fourthStepPickupAddressBookId; // this.fourth_step_pickup_address_book_id;
    if (this.selectedSenderNotificationType.length) {
      payload.shipment_sender_notification = JSON.stringify(
        this.selectedSenderNotificationType
      );
    } else {
      payload.shipment_sender_notification = null;
    }

    if (this.selectedRecipientNotificationType.length) {
      payload.shipment_recipient_notification = JSON.stringify(
        this.selectedRecipientNotificationType
      );
    } else {
      payload.shipment_recipient_notification = null;
    }
    if(this.jazvaOrderId) {
      payload.jazva_order_id = this.jazvaOrderId;
    }
    const fd: any = this.utilService.genrateFormData(payload);
    this.shipmentNowService.addUpdateShipNowForthStep(fd).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          if (this.fourthStepShipmentBillingPrefrenceId) {
            this.fourthStepShipmentBillingPrefrenceId = this.fourthStepShipmentBillingPrefrenceId;
          } else {
            this.fourthStepShipmentBillingPrefrenceId = res.data.shipment_billing_prefrence_id;
          }

          if (this.fourthStepPickupAddressBookId) {
            this.fourthStepPickupAddressBookId = this.fourthStepPickupAddressBookId;
          } else {
            this.fourthStepPickupAddressBookId = res.data.pickup_address_book_id;
          }
        }
        this.stepperTriggerEmitter.emit(res);
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