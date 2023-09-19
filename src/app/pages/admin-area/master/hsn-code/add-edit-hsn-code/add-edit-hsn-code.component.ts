import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { UtilService } from "../../../../../shared/common- services/util.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbToastrService } from "@nebular/theme";
import { HsnCodeService } from "../../../../../shared/component-services/admin-area.services.ts/hsn-code.service";
import { FormBuilder, FormControl } from "@angular/forms";

@Component({
  selector: "ngx-add-edit-hsn-code",
  templateUrl: "./add-edit-hsn-code.component.html",
  styleUrls: ["./add-edit-hsn-code.component.scss"],
})
export class AddEditHsnCodeComponent implements OnDestroy {
  public subscription: Subscription[] = [];

  public hsnCodeId: any = null;

  public hsnCodeDetials: any = {};

  public isLoading: boolean = false;

  public setDefaultValue = "Not Applicable";

  constructor(
    public hsnCodeService: HsnCodeService,
    public fb: FormBuilder,
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      if (params.hsn_code_id) {
        this.hsnCodeId = atob(params.hsn_code_id);
      }
      if (this.hsnCodeId) {
        this.getHSNCodeDataById();
      }
      // else{
      //   this.router.navigate(["pages/admin-area/master/hsn-code-list"]);
      // }
    });
  }

  //validators //
  public formValidations: any = {
    harmonized_system_code: [
      { type: "required", message: "HSN Code is required" },
    ],
    description: [{ type: "required", message: "Description is required" }],
  };

  hsnCodeFrom = this.fb.group({
    harmonized_system_code_id: new FormControl(""),
    harmonized_system_code: new FormControl(""),
    material: new FormControl(""),
    description: new FormControl(""),
    gender: new FormControl(""),
  });

  public getHSNCodeDataById() {
    this.subscription.push(
      this.hsnCodeService.getHSNCodeDataById(this.hsnCodeId).subscribe(
        (res: any) => {
          this.hsnCodeDetials = res.data;
          if (this.hsnCodeId) {
            this.hsnCodeFrom.patchValue(this.hsnCodeDetials);
          }
          // console.log( this.hsnCodeDetials,' this.hsnCodeDetials====');
        },
        (error) => {
          if (error && error.error.errors && error.error.errors.failed) {
            this.router.navigate(["pages/admin-area/master/hsn-code-list"]);
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  public onSubmit() {
    this.isLoading = true;
    this.hsnCodeFrom.markAllAsTouched();
    if (this.hsnCodeFrom.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj = this.hsnCodeFrom.value;
    if (this.hsnCodeId) {
      payloadObj.harmonized_system_code_id = this.hsnCodeId;
    }
    this.subscription.push(
      this.hsnCodeService.onSaveHSNData(payloadObj).subscribe(
        (res: any) => {
          this.toastrService.success(res.message, "Success");
          this.isLoading = false;
          this.router.navigate(["pages/admin-area/master/hsn-code-list"]);
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
    this.router.navigate(["pages/admin-area/master/hsn-code-list"]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
