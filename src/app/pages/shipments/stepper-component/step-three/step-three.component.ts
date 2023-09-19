import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ShipmentNowService } from '../../../../shared/component-services/shipment-now.service';
import { NbDateService, NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';
import { Subscription } from 'rxjs';
import { DialogNamePromptComponent } from '../../dialog-name-prompt/dialog-name-prompt.component';
import * as moment from 'moment';

@Component({
  selector: 'ngx-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit {
  public bookShipmentThirdForm: UntypedFormGroup;
  public isLoading: boolean = false;
  public package_details!: FormArray;
  public isIdenticalRedioValue = "0";
  public packageTypeData: Array<any> = [];
  public subscription: Subscription[] = [];
  public dimensionsSaveData: Array<any> = [];
  public externalShippingMethodData: Array<any> = [];
  public serviceTypeData: Array<any> = [];
  public packageContentsData: Array<any> = [];
  public shipmentPurposeData: Array<any> = [];
  public currencyArray: Array<any> = [];
  public isExternalShippingMethod: boolean = false;
  public secondStepShipmentBookingRecipientId: any = 0;
  public min: Date;
  public max: Date;

  @Input() public shipmentDetail: any = null;
  @Input() public shipmentBookingId: any = null;
  @Input() public jazvaOrderId: any = null;
  @Input() public allFormFieldsDisabled: boolean = false;
  @Input() public firstStepShipmentBookingId: any = null;
  @Input() public thirdStepShipmentBookingPackageId: any = null;
  @Output() stepperTriggerEmitter: EventEmitter<any> = new EventEmitter();
  @Output() isFormValidCheckEmitter: EventEmitter<boolean> = new EventEmitter(false);

  public thirdFormFormValidations: any = {
    shipment_date: [{ type: "required", message: "Shipment Date is required" }],
    package_type_id: [{ type: "required", message: "Package Type is required" }],
    number_of_packages: [
      { type: "required", message: "Number Of Packages is required" },
    ],
    service_type_id: [
      { type: "required", message: "Service Type is required" },
    ],
    external_shipping_method_id:[
      { type: "required", message: "External Type is required" },
    ],
    package_content_id: [
      { type: "required", message: "Package Contents is required" },
    ],
    shipment_purpose_id: [
      { type: "required", message: "Shipment Purpose is required" },
    ],
    is_identical_package: [
      { type: "required", message: "Identical Package is required" },
    ],
    weight_per_package: [
      { type: "required", message: "Weight Per Package is required" },
    ],
    declared_value: [
      { type: "required", message: "Declared Value is required" },
    ],
    currency_id: [{ type: "required", message: "Currency is required" }],
  };

  constructor(
    private fb: UntypedFormBuilder,
    public utilService: UtilService,
    public shipmentNowService: ShipmentNowService,
    private dialogService: NbDialogService,
    private router: Router,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>
  ) {
    this.getPackageType();
    this.serviceType();
    this.packageContents();
    this.shipmentPurpose();
    this.currencyData();
    this.getDimensionsBookSave();
   }

  ngOnInit(): void {
    this.bookShipmentThirdForm = this.fb.group({
      shipment_booking_id: [0],
      shipment_booking_package_id: [0],
      shipment_date: [null, Validators.required],
      package_type_id: ["", Validators.required],
      number_of_packages: [1],
      service_type_id: ["", Validators.required],
      external_shipping_method_id: ["", Validators.required],
      package_content_id: ["", Validators.required],
      shipment_purpose_id: ["", Validators.required],
      declared_value: [0],
      currency_id: ["1"],
      is_identical_package: ["0", Validators.required],
      weight_per_package: [0, Validators.required],
      weight_unit: ["kg", Validators.required],
      package_details: new FormArray([]),
    });

    if(this.shipmentBookingId) {
      if(this.shipmentDetail) {
        this.thirdStepShipmentBookingPackageId = this.shipmentDetail.shipment_booking_package.shipment_booking_package_id;
        this.setValueThirdForm(this.shipmentDetail.shipment_booking_package, this.shipmentDetail);
      } else {
        this.min = this.dateService.addDay(this.dateService.today(), 1);
        this.package_details = this.bookShipmentThirdForm.get(
          "package_details"
        ) as FormArray;
          this.package_details.push(
            this.addMoreNoOfPackagesArray()
          );
      }
    }

    if(!this.shipmentBookingId) {
      this.min = this.dateService.addDay(this.dateService.today(), 0);
      if ("11:59" <= moment().format("HH:mm")) {
        this.min = this.dateService.addDay(this.dateService.today(), 1);
      }
    }

    if(!this.shipmentBookingId) {
      this.onChangeIdenticalPackage('0');
    }

    this.bookShipmentThirdForm.valueChanges.subscribe((res: any) => {
      if(this.bookShipmentThirdForm.invalid) {
        this.isFormValidCheckEmitter.next(true);
      }
    })
  }

  serviceType() {
    this.subscription.push(
      this.shipmentNowService.getServiceType().subscribe(
        (res: any) => {
          this.serviceTypeData = res.data;
        },
        (error) => { }
      )
    );
  }

  packageContents() {
    this.subscription.push(
      this.shipmentNowService.getpackageContentsType().subscribe(
        (res: any) => {
          this.packageContentsData = res.data;
        },
        (error) => { }
      )
    );
  }

  shipmentPurpose() {
    this.subscription.push(
      this.shipmentNowService.getshipmentPurposeType().subscribe(
        (res: any) => {
          this.shipmentPurposeData = res.data;
        },
        (error) => { }
      )
    );
  }

  currencyData() {
    this.subscription.push(
      this.shipmentNowService.getCurrencyData().subscribe(
        (res: any) => {
          this.currencyArray = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  getPackageType() {
    this.subscription.push(
      this.shipmentNowService.getPackageType().subscribe(
        (res: any) => {
          this.packageTypeData = res.data;
        },
        (error) => { }
      )
    );
  }

  onChangeIdenticalPackage(eve: any) {
    if (eve === "0") {
      this.bookShipmentThirdForm.get("number_of_packages").setValue(1);
      this.bookShipmentThirdForm
        .get("number_of_packages")
        .setValidators([Validators.required]);
      this.bookShipmentThirdForm
        .get("number_of_packages")
        .updateValueAndValidity();

      this.bookShipmentThirdForm.get("declared_value").setValue('0');
      this.bookShipmentThirdForm.get("declared_value").clearValidators();
      this.bookShipmentThirdForm.get("declared_value").updateValueAndValidity();

      this.bookShipmentThirdForm
        .get("currency_id")
        .setValidators([Validators.required]);
      this.bookShipmentThirdForm.get("currency_id").updateValueAndValidity();

      this.bookShipmentThirdForm.get("weight_per_package").setValue(null);
      this.bookShipmentThirdForm.get("weight_per_package").clearValidators();
      this.bookShipmentThirdForm.get("weight_per_package").updateValueAndValidity();

      this.bookShipmentThirdForm.get("weight_unit").setValue("");
      this.bookShipmentThirdForm.get("weight_unit").clearValidators();
      this.bookShipmentThirdForm.get("weight_unit").updateValueAndValidity();

      this.package_details = this.bookShipmentThirdForm.get(
        "package_details"
      ) as FormArray;
      this.package_details.push(this.addMoreNoOfPackagesArray());
    } else {
      const companyArray = this.bookShipmentThirdForm.get(
        "package_details"
      ) as FormArray;
      companyArray.clear();
      this.bookShipmentThirdForm.get("number_of_packages").setValue(0);
      this.bookShipmentThirdForm.get("number_of_packages").clearValidators();
      this.bookShipmentThirdForm
        .get("number_of_packages")
        .updateValueAndValidity();

      this.bookShipmentThirdForm.get("currency_id").setValue("1");
      this.bookShipmentThirdForm.get("currency_id").clearValidators();
      this.bookShipmentThirdForm.get("currency_id").updateValueAndValidity();

      this.bookShipmentThirdForm.get("weight_per_package").setValue(null);
      this.bookShipmentThirdForm.get("weight_per_package").setValidators([Validators.required]);
      this.bookShipmentThirdForm.get("weight_per_package").updateValueAndValidity();

      this.bookShipmentThirdForm
      .get("declared_value")
      .setValidators([Validators.required]);
      this.bookShipmentThirdForm.get("declared_value").setValue('0');
      this.bookShipmentThirdForm.get("declared_value").updateValueAndValidity();

      this.bookShipmentThirdForm.get("weight_unit").setValue("kg");
      this.bookShipmentThirdForm
        .get("weight_unit")
        .setValidators([Validators.required]);
      this.bookShipmentThirdForm.get("weight_unit").updateValueAndValidity();

      let frmArray = this.bookShipmentThirdForm.get(
        "package_details"
      ) as FormArray;
      frmArray.clear();
    }
  }

  public addMoreNoOfPackagesArray(obj?: any) {
    return this.fb.group({
      dimension_id: [0],
      quantity: [obj && obj.quantity ? obj.quantity : 0],
      weight: [obj && obj.weight ? obj.weight : null, Validators.required],
      weight_unit: [obj && obj.weight_unit ? obj.weight_unit : "kg"],
      length: [obj && obj.length ? obj.length : null],
      width: [obj && obj.width ? obj.width : null],
      height: [obj && obj.height ? obj.height : null],
      size_unit: [obj && obj.size_unit ? obj.size_unit : "inch"],
      declared_value: [
        obj && obj.declared_value ? obj.declared_value : null,
        Validators.required,
      ],
      is_non_standard_package: [
        obj && obj.is_non_standard_package ? true : false,
      ],
      is_dangerous_goods: [obj && obj.is_dangerous_goods ? true : false],
      dangerous_description: [
        obj && obj.dangerous_description ? obj.dangerous_description : "",
      ],
    });
  }

  public getControls() {
    return (this.bookShipmentThirdForm.get("package_details") as FormArray)
      .controls;
  }

  allowNumericDigitsOnlyOnKeyUp(e: any) {
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
		}
    return true;
	}

  afterPointTwoValueCheck(eve: any, formControlValue?: any, controlName?: any) {
    let value = eve.target.value;
    if (Number.isInteger(value)) {
      return 0;
    }
    const decimalStr = value.toString().split('.')[1];
    if(decimalStr && decimalStr.length > 2) {
      formControlValue.get(controlName).setValue(parseFloat(value).toFixed(2));
    }
  }

  afterPointThreeValueCheck(eve: any, formControlValue?: any, controlName?: any) {
    let value = eve.target.value;
    if (Number.isInteger(value)) {
      return 0;
    }
    const decimalStr = value.toString().split('.')[1];
    if(decimalStr && decimalStr.length > 2) {
      formControlValue.get(controlName).setValue(parseFloat(value).toFixed(3));
    }
  }

  getDimensionsBookSave() {
    this.subscription.push(
      this.shipmentNowService.getDimensionsBook().subscribe(
        (res: any) => {
          if (res && res.data) {
            this.dimensionsSaveData = res.data;
          }
        },
        (error) => { }
      )
    );
  }

  dimensionsSave(dimensionsObj) {
    if(dimensionsObj.value.length <= 0 || dimensionsObj.value.width <= 0 || dimensionsObj.value.height <= 0) {
      this.toastrService.danger("Please Enter Length, Width and Height value must be grater than 0.");
      return;
    }
    let payloadObj: any = {
      dimension_id: dimensionsObj.value.dimension_id,
      length: dimensionsObj.value.length,
      width: dimensionsObj.value.width,
      height: dimensionsObj.value.height,
      size_unit: dimensionsObj.value.size_unit,
    };
    const fd: any = this.utilService.genrateFormData(payloadObj);
    this.shipmentNowService.saveDimensions(fd).subscribe(
      (res: any) => {
        this.toastrService.success(res.message, "Success");
        if (res && res.data) {
          dimensionsObj.controls.dimension_id.setValue(res.data.dimension_id);
          this.getDimensionsBookSave();
        }
      },
      (error) => {
        // this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    );
  }

  openDimensionsDialog(experiencesObj) {
    this.dialogService
      .open(DialogNamePromptComponent, {
        context: {
          step: 3,
          addressArray: this.dimensionsSaveData,
        },
      })
      .onClose.subscribe((returnedObj) => {
        if (returnedObj) {
          experiencesObj.controls.dimension_id.setValue(
            returnedObj.dimension_id
          );
          experiencesObj.controls.length.setValue(returnedObj.length);
          experiencesObj.controls.width.setValue(returnedObj.width);
          experiencesObj.controls.height.setValue(returnedObj.height);
          experiencesObj.controls.size_unit.setValue(returnedObj.size_unit);
        }
      });
  }

  valueChange(e: any) {
    this.bookShipmentThirdForm.get("declared_value").setValue(e.target.value);
  }

  openDangerousGoodsDescriptionModal(event: any, formControl: any) {
    if(event.target.checked) {
      this.dialogService
        .open(ShowcaseDialogComponent, {
          context: {
            title: "Dangerous Goods Description",
            dialogName: "dangerousGoodsDesc"
          },
        })
        .onClose.subscribe((returnedObj) => {
          if (returnedObj) {
            formControl.controls.dangerous_description.setValue(returnedObj);
          }
        });
    }
  }

  getServiceTypeValue(service_type_id:any) {
    if(service_type_id == 2){
      this.isExternalShippingMethod = true;
      this.getExternalShippingMethod()
      this.bookShipmentThirdForm.get("external_shipping_method_id").setValidators([Validators.required]);
      this.bookShipmentThirdForm.get("external_shipping_method_id").updateValueAndValidity();
    }else{
      this.isExternalShippingMethod = false;
      this.bookShipmentThirdForm.get('external_shipping_method_id')?.setValue('')
      this.bookShipmentThirdForm.get("external_shipping_method_id").clearValidators();
      this.bookShipmentThirdForm.get("external_shipping_method_id").updateValueAndValidity();
    }
  }

  getExternalShippingMethod() {
    this.subscription.push(
      this.shipmentNowService.getExternalShippingData().subscribe(
        (res: any) => {
          this.externalShippingMethodData = res.data;
        },
        (error) => { }
      )
    );
  }

  setValueThirdForm(obj: any, data?: any) {
    this.bookShipmentThirdForm
      .get("shipment_date")
      .setValue(new Date(obj.shipment_date));
    if(obj.shipment_date) {
      this.min = this.dateService.addDay(new Date(obj.shipment_date), 0);
    }
    this.bookShipmentThirdForm
      .get("package_type_id")
      .setValue(obj.package_type_id.toString());
    if(obj.is_identical_package) {
      this.bookShipmentThirdForm
        .get("declared_value")
        .setValidators([Validators.required]);
      this.bookShipmentThirdForm.get("declared_value").updateValueAndValidity();
    }
    this.bookShipmentThirdForm
      .get("is_identical_package")
      .setValue(obj.is_identical_package.toString());
    if (obj.is_identical_package === 1) {
      this.bookShipmentThirdForm
        .get("weight_per_package")
        .setValue(obj.weight_per_package);
      this.bookShipmentThirdForm.get("weight_unit").setValue(obj.weight_unit);
    }
    if (obj.is_identical_package === 0) {
      this.bookShipmentThirdForm
        .get("number_of_packages")
        .setValue(obj.number_of_packages);
      this.package_details = this.bookShipmentThirdForm.get(
        "package_details"
      ) as FormArray;
      for (
        let index = 0;
        index < data.shipment_booking_package_detail.length;
        index++
      ) {
        this.package_details.push(
          this.addMoreNoOfPackagesArray(
            data.shipment_booking_package_detail[index]
          )
        );
      }
    }
    this.bookShipmentThirdForm
    .get("service_type_id")
    .setValue(obj.service_type_id.toString());
    if(obj.service_type_id == 2){
      this.isExternalShippingMethod = true;
      this.getServiceTypeValue(2);
      this.bookShipmentThirdForm.get("external_shipping_method_id").setValue(obj.external_shipping_method_id.toString());
    } else {
      this.bookShipmentThirdForm.get('external_shipping_method_id')?.setValue('')
      this.bookShipmentThirdForm.get("external_shipping_method_id").clearValidators();
      this.bookShipmentThirdForm.get("external_shipping_method_id").updateValueAndValidity();
    } 
    this.bookShipmentThirdForm
      .get("package_content_id")
      .setValue(obj.package_content_id.toString());
    this.bookShipmentThirdForm
      .get("shipment_purpose_id")
      .setValue(obj.shipment_purpose_id.toString());
    this.bookShipmentThirdForm
      .get("declared_value")
      .setValue(obj.declared_value);
    this.bookShipmentThirdForm
      .get("currency_id")
      .setValue("1");
  }

  saveThirdStep() {
    this.bookShipmentThirdForm.markAllAsTouched();
    this.bookShipmentThirdForm.updateValueAndValidity();
    if (this.bookShipmentThirdForm.invalid) {
      return;
    }
    this.isLoading = true;
    let payload: any = this.bookShipmentThirdForm.value;
    payload.shipment_booking_id = this.firstStepShipmentBookingId;
    payload.shipment_booking_package_id = this.thirdStepShipmentBookingPackageId;
    payload.shipment_date = moment
      .utc(payload.shipment_date)
      .local()
      .format("YYYY-MM-DD");
    payload.number_of_packages = payload.number_of_packages
      ? payload.number_of_packages
      : 1;
    payload.package_details.forEach((element: any) => {
      element.is_non_standard_package = element.is_non_standard_package ? 1 : 0;
      element.is_dangerous_goods = element.is_dangerous_goods ? 1 : 0;
    });
    if(this.jazvaOrderId) {
      payload.jazva_order_id = this.jazvaOrderId;
    }
    payload.package_details = JSON.stringify(payload.package_details);
    const fd: any = this.utilService.genrateFormData(payload);
    this.shipmentNowService.addUpdateShipNowThirdStep(fd).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res && res.data) {
          res.data.shipment_date = this.bookShipmentThirdForm.get('shipment_date').value;
          if (res.data.shipment_booking_recipient_id) {
            this.secondStepShipmentBookingRecipientId = res.data.shipment_booking_recipient_id;
          }
          if (this.thirdStepShipmentBookingPackageId) {
            this.thirdStepShipmentBookingPackageId = this.thirdStepShipmentBookingPackageId;
          } else {
            this.thirdStepShipmentBookingPackageId = res.data.shipment_booking_package_id;
          }
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
