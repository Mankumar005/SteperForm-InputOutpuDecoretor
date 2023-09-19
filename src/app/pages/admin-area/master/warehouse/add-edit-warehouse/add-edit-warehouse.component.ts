import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { UtilService } from "../../../../../shared/common- services/util.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { WareHouseService } from "../../../../../shared/component-services/admin-area.services.ts/warehouse.service";

@Component({
  selector: "ngx-add-edit-warehouse",
  templateUrl: "./add-edit-warehouse.component.html",
  styleUrls: ["./add-edit-warehouse.component.scss"],
})
export class AddEditWarehouseComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];

  public countryList: Array<any> = [];
  public stateList: Array<any> = [];

  public warehouseId: any = null;

  public warehouseDetials: any = {};
  public countryObj: any = {};

  public isLoading: boolean = false;

  constructor(
    public warehousService: WareHouseService,
    public fb: FormBuilder,
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if(params.vayu_logi_location_id) {
        this.warehouseId = atob(params.vayu_logi_location_id);
      }
      if (this.warehouseId) {
        this.getWarehouseDataById();
      }
    });
  }
  //validators //
  public formValidations: any = {
    location_name: [{ type: "required", message: "Location Name is required" }],
    address1: [{ type: "required", message: "Address is required" }],
    city: [{ type: "required", message: "City is required" }],
    country_id: [{ type: "required", message: "Country is required" }],
    state_id: [{ type: "required", message: "State is required" }],
  };

  warehouseFrom = this.fb.group({
    vayu_logi_location_id: new FormControl(""),
    location_name: new FormControl(""),
    address1: new FormControl(""),
    address2: new FormControl(""),
    city: new FormControl(""),
    zip_code: new FormControl(""),
    country_id: new FormControl(null),
    state_id: new FormControl(null),
  });

  ngOnInit(): void {
    this.getCountryList();
  }

  public getCountryList() {
    this.subscription.push(
      this.warehousService.getCountryList().subscribe(
        (res: any) => {
          this.countryList = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  public getStateListById(country_id: any) {
    this.subscription.push(
      this.warehousService.getStateListById(country_id).subscribe(
        (res: any) => {
          this.stateList = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  // get select dropdown value //
  public selectCountryValue(country_val: any) {
    this.countryObj = country_val;
    this.getStateListById(this.countryObj.country_id);
  }

  public getWarehouseDataById() {
    this.subscription.push(
      this.warehousService.getWarehouseDataById(this.warehouseId).subscribe(
        (res: any) => {
          this.warehouseDetials = res.data;
          if (this.warehouseId) {
            this.warehouseFrom.patchValue(this.warehouseDetials);
            this.warehouseFrom
              .get("country_id")
              .setValue(this.warehouseDetials.country_id);
            this.getStateListById(this.warehouseDetials.country_id);
          }
          // console.log( this.warehouseDetials,' this.warehouseDetials====');
        },
        (error) => {
          if (error && error.error.errors && error.error.errors.failed) {
            this.router.navigate(["pages/admin-area/master/warehouse-list"]);
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  public onSubmit() {
    this.isLoading = true;
    this.warehouseFrom.markAllAsTouched();
    if (this.warehouseFrom.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj = this.warehouseFrom.value;
    if (this.warehouseId) {
      payloadObj.vayu_logi_location_id = this.warehouseId;
    }
    this.subscription.push(
      this.warehousService.onSaveWarehouseData(payloadObj).subscribe(
        (res: any) => {
          this.toastrService.success(res.message, "Success");
          this.isLoading = false;
          this.router.navigate(["pages/admin-area/master/warehouse-list"]);
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
    this.router.navigate(["pages/admin-area/master/warehouse-list"]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
