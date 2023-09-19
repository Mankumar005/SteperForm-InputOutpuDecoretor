import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ShipmentNowService } from '../../../../shared/component-services/shipment-now.service';
import { NbDateService, NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ShowcaseDialogComponent } from '../../showcase-dialog/showcase-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-step-fifth',
  templateUrl: './step-fifth.component.html',
  styleUrls: ['./step-fifth.component.scss']
})
export class StepFifthComponent implements OnInit {
  public bookShipmentFiveForm: UntypedFormGroup;
  public commodities!: FormArray;
  public isSpinnerLoader: boolean = false;
  public harmonizedCodeDataArray: Array<any> = [];
  public manufactureCountryData: Array<any> = [];
  public subscription: Subscription[] = [];

  public lastStepTotalQty = 0;
  public lastStepTotalWeight = 0;
  public lastStepTotalCustValue = 0;

  @Input() public shipmentDetail: any = null;
  @Input() public shipmentBookingId: any = null;
  @Input() public allFormFieldsDisabled: boolean = false;
  @Input() public firstStepShipmentBookingId: any = null;
  @Input() public jazvaOrderId: any = null;
  @Output() stepperTriggerEmitter: EventEmitter<any> = new EventEmitter();
  @Output() isFormValidCheckEmitter: EventEmitter<boolean> = new EventEmitter(false);

  constructor(
    private fb: UntypedFormBuilder,
    public utilService: UtilService,
    public shipmentNowService: ShipmentNowService,
    private dialogService: NbDialogService,
    private router: Router,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>
  ) {
    this.getCountry();
    this.harmonizedCodeData();
  }

  ngOnInit(): void {
    this.bookShipmentFiveForm = this.fb.group({
      isRequired: [null, Validators.required],
      commodities: new FormArray([]),
    });

    if(this.shipmentBookingId) {
      if(this.shipmentDetail) {
        this.setValueFifthForm(this.shipmentDetail.shipment_booking_commodity);
      }
    }

    this.bookShipmentFiveForm.valueChanges.subscribe((res: any) => {
      if(this.bookShipmentFiveForm.invalid) {
        this.isFormValidCheckEmitter.next(true);
      }
    })
  }

  setValueFifthForm(commoditiesArray: any) {
    this.commodities = this.bookShipmentFiveForm.get(
      "commodities"
    ) as FormArray;
    for (let index = 0; index < commoditiesArray.length; index++) {
      this.commodities.push(
        this.addMoreNoOfcommodityInformationArray(commoditiesArray[index])
      );
    }
    this.qtyChange();
    this.weightChange();
    this.customsvalueChange();
  }

  harmonizedCodeData() {
    this.subscription.push(
      this.shipmentNowService.getHarmonizedCodeData().subscribe(
        (res: any) => {
          this.harmonizedCodeDataArray = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  getCountry() {
    this.subscription.push(
      this.shipmentNowService.getCountryData().subscribe(
        (res: any) => {
          this.manufactureCountryData = res.data;
        },
        (error) => { }
      )
    );
  }

  qtyChange() {
    if (this.commodities.value.length) {
      this.lastStepTotalQty = 0;
      this.commodities.value.forEach((element: any) => {
        const qty = element.quantity ? parseInt(element.quantity) : 0;
        this.lastStepTotalQty = this.lastStepTotalQty + qty;
      });
      this.checkFifthSetpValidation(this.commodities);
    }
  }

  weightChange() {
    if (this.commodities.value.length) {
      this.lastStepTotalWeight = 0;
      this.commodities.value.forEach((element: any) => {
        const weight = element.weight ? parseFloat(element.weight) : 0;
        this.lastStepTotalWeight = this.lastStepTotalWeight + weight;
      });
      this.checkFifthSetpValidation(this.commodities);
    }
  }

  customsvalueChange() {
    if (this.commodities.value.length) {
      this.lastStepTotalCustValue = 0;
      this.commodities.value.forEach((element: any) => {
        const customsvalue = element.declared_value
          ? parseFloat(element.declared_value)
          : 0;
        this.lastStepTotalCustValue =
          this.lastStepTotalCustValue + customsvalue;
      });
      this.checkFifthSetpValidation(this.commodities);
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

  allowNumericDigitsOnlyOnKeyUp(e: any) {
		const charCode = e.which ? e.which : e.keyCode;
		if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      return false;
		}
    return true;
	}

  checkFifthSetpValidation(commodities: any) {
    let filterData: any = commodities.value.filter((value: any) => value.quantity <= 0 || value.weight <= 0 || value.declared_value <= 0);
    if(filterData.length) {
      this.bookShipmentFiveForm.get('isRequired').setValidators(Validators.required);
      this.bookShipmentFiveForm.get("isRequired").updateValueAndValidity();
    } else {
      this.bookShipmentFiveForm.get("isRequired").clearValidators();
      this.bookShipmentFiveForm.get("isRequired").updateValueAndValidity();
    }
  }

  selectmanufactureCountry(controlObj: any, selectCountry: any) {
    controlObj.controls.manufacture_country_iso_code.setValue(
      selectCountry.country_iso_code
    );
  }

  public removeCommodityInformation(index: any) {
    (this.bookShipmentFiveForm.get("commodities") as FormArray).removeAt(index);
    if (this.commodities.value.length) {
      this.qtyChange();
      this.weightChange();
      this.customsvalueChange();
    } else {
      this.lastStepTotalQty = 0;
      this.lastStepTotalWeight = 0;
      this.lastStepTotalCustValue = 0;
    }
  }

  public addMorecommodityInformation(): void {
    this.commodities = this.bookShipmentFiveForm.get(
      "commodities"
    ) as FormArray;
    this.commodities.push(this.addMoreNoOfcommodityInformationArray());
  }

  public addMoreNoOfcommodityInformationArray(obj?: any) {
    return this.fb.group({
      item_name: [
        obj && obj.item_name ? obj.item_name : "",
        Validators.required,
      ],
      harmonized_system_code_id: [
        obj && obj.harmonized_system_code_id
          ? parseInt(obj.harmonized_system_code_id)
          : null,
        Validators.required,
      ],
      manufacture_country_iso_code: [
        obj && obj.manufacture_country_iso_code
          ? obj.manufacture_country_iso_code
          : null,
      ],
      manufacture_country_id: [
        obj && obj.manufacture_country_id ? obj.manufacture_country_id : null,
        Validators.required,
      ],
      quantity: [obj && obj.quantity ? obj.quantity : null, Validators.required],
      weight: [obj && obj.weight ? obj.weight : null, Validators.required],
      weight_unit: [
        obj && obj.weight_unit ? obj.weight_unit : "kg",
        Validators.required,
      ],
      declared_value: [
        obj && obj.declared_value ? obj.declared_value :null,
        Validators.required,
      ],
      product_url: [null],
      sku: [null],
    });
  }

  public getcommodityInformationControls() {
    return (this.bookShipmentFiveForm.get("commodities") as FormArray).controls;
  }

  saveFifthStep() {
    let payload: any = this.bookShipmentFiveForm.value;
    let checkCommoditiesZeroValue = payload.commodities.filter((element: any) => element.quantity <= 0 || element.weight <= 0 || element.declared_value <= 0);
    if(checkCommoditiesZeroValue.length) {
      this.toastrService.danger("Please Enter Quantity, Weight and Customs value must be grater than 0.");
    }
    
    this.bookShipmentFiveForm.markAllAsTouched();
    this.bookShipmentFiveForm.updateValueAndValidity();
    if (this.bookShipmentFiveForm.invalid) {
      return;
    }
    this.isSpinnerLoader = true;
    payload.shipment_booking_id = this.firstStepShipmentBookingId;
    payload.commodities = JSON.stringify(payload.commodities);
    if(this.jazvaOrderId) {
      payload.jazva_order_id = this.jazvaOrderId;
    }
    const fd: any = this.utilService.genrateFormData(payload);
    this.shipmentNowService.addUpdateShipNowFifthStep(fd).subscribe(
      (res: any) => {
        this.isSpinnerLoader = false;
        this.stepperTriggerEmitter.emit(res);
      },
      (error) => {
        this.isSpinnerLoader = false;
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