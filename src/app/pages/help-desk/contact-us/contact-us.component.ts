import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilService } from "../../../shared/common- services/util.service";
import { HelpDeskService } from "../../../shared/component-services/help-desk.service";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit,OnDestroy  {
  public subscription: Subscription[] = [];

  public userDetails: any = null;

  public isLoading: boolean = false;

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public helpDeskService: HelpDeskService,
    private toastrService: NbToastrService
  ) {}

  public formValidations: any = {
    subject: [
      { type: "required", message: "Subject is required" },
      { type: "pattern", message: "White space not allowed" }
    ],
    message: [{ type: "required", message: "Message is required" }],
  };

  contactUsFrom: FormGroup = this.fb.group({
    user_id: new FormControl(""),
    subject: new FormControl(""),
    message: new FormControl(""),
  });

  ngOnInit(): void {
    this.userDetails = this.utilService.getLocalStorageValue("userDetail");
  }

  public onSubmit() {
    this.isLoading = true;
    this.contactUsFrom.markAllAsTouched();
    if (this.contactUsFrom.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj: any = {};
    payloadObj = this.contactUsFrom.value
    payloadObj.user_id = this.userDetails.user_id;
    // console.log(payloadObj, "payloadObj====");
    this.subscription.push(this.helpDeskService.onSaveContactUsData(payloadObj).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toastrService.success(res.message, "Success");
        this.contactUsFrom.reset()
      },
      (error) => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
        this.toastrService.danger(error.error.errors.message, "Error");
      }
    ));
  }

public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
} 
}
