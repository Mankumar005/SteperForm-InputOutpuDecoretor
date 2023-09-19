import {Component,ElementRef,ViewChild,AfterViewInit,OnInit,OnDestroy} from "@angular/core";
import {FormBuilder,FormControl,FormGroup,Validators} from "@angular/forms";
import { Router } from "@angular/router";
import { UtilService } from "../../shared/common- services/util.service";
import { NbToastrService } from "@nebular/theme";
import { PasswordStrengthValidator } from "../../shared/custom-validator/password.validator";
import { registerService } from "../../shared/auth-services/auth-component-services/register-service";
import { Subject, Subscription, fromEvent } from "rxjs";
import {debounceTime,distinctUntilChanged,filter,tap} from "rxjs/operators";
import { NgOtpInputConfig } from 'ng-otp-input';
@Component({
  selector: "ngx-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild("getGSTFile") public getGSTFile: any;
  @ViewChild("getPANFile") public getPANFile: any;
  @ViewChild("getUdyogAdharFile") public getUdyogAdharFile: any;
  @ViewChild("getPhotoFile") public getPhotoFile: any;
  @ViewChild("inputEmail", { static: false }) inputEmail!: ElementRef;
  @ViewChild('ngOtpInput') ngOtpInput: any;

  public OtpUpdate = new Subject<string>();
  
  public searchControl!: FormControl;
  public subscription: Subscription[] = [];

  public countryList: Array<any> = [];
  public stateList: Array<any> = [];
  public shippingTypesList: Array<any> = [];
  public natuerBusinessList: Array<any> = [];
  public shipmentFrequenciesList: Array<any> = [];

  public fileToUploadName: any = "";
  public fileName: any = "";
  public gstFileName: any = "";
  public panFileName: any = "";
  public photoIdFileName: any = "";
  public udyogAdharFileName: any = "";
  public email: string = '';
  public phone: string = '';

  public fileObj: any = {};
  public selectValueObj: any = {};
  public countryDataObj: any = {};

  public isWrongResumeUpload: boolean = false;
  public isLoading: boolean = false;
  public hide: boolean = true;
  public isLogedIn: boolean = false;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public isLoadingEmail: boolean = false;
  public isExistingEmail: boolean = false;
  public isSelectCountry: boolean = false;
  public isGSTExempted: boolean = false;
  public isRequiredField: boolean = false;
  public isUdyogAdhar: boolean = false;

  public isOtpBlank: boolean = false;
  public isSendPhoneOTP: boolean = false;
  public isViewPhoneOTPVerification: boolean = false;
  public isVerifyPhoneMessage: boolean = false;
  public isVerifyPhoneLoading: boolean = false;
  public isPhoneVerifiedIcon: boolean = false;
  public isResendPhoneOTP: boolean = false;

  public isSendOTPOnEmail: boolean = false;
  public isViewEmailOTPVerification: boolean = false;
  public isVerifyEmailMessage: boolean = false;
  public isVerifyEmailLoading: boolean = false;
  public isEmailVerifiedIcon: boolean = false;
  public isResendEmailOTP: boolean = false;
  public isStopVerifyEmail: boolean = false;

  public otpMessages: number = 0;
  public emailOTPResendTimer: number = 0;
  public phoneOTPResendTimer: number = 0;

  public optInputConfig: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
  };

  public extraa: any;

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public authService: registerService,
    public router: Router,
    private toastrService: NbToastrService
  ) {
    this.OtpUpdate.pipe(debounceTime(100)).subscribe((value: any) => {
      this.otpMessages = value;
    });
  }

  public formValidations: any = {
    // step -1 userDetailsForm validators//
    first_name: [{ type: "required", message: "First Name is required" }],
    last_name: [{ type: "required", message: "Last Name is required" }],
    phone: [{ type: "required", message: "Phone is required" },
      { type: "pattern", message: "Phone number must be 10 digits" }],
    phone_extension:[{ type: "required", message: "Extention Phone is required" },],
    company_name: [{ type: "required", message: "Company is required" }],
    address1: [{ type: "required", message: "Address is required" }],
    country_id: [{ type: "required", message: "Country is required" }],
    searchControl: [{ type: "required", message: "Zip Code is required" }],
    state_id: [{ type: "required", message: "State is required" }],
    city: [{ type: "required", message: "City is required" }],
    email: [{ type: "required", message: "Email is required" },
            { type: "pattern", message: "Enter valid email" },],
    password: [{ type: "required", message: "Password is required" }],
    confirm_password:[{ type: "required", message: "Confirm Password is required" },],

    // step -2 companyDetailsForm validators//
    gst_exempted: [{ type: "required", message: "GST Exempted is required" }],
    gst_no: [{ type: "required", message: "GST No. is required" }],
    gst_document_url: [{ type: "required", message: "GST File is required" }],
    pan_document_url: [{ type: "required", message: "PAN Card is required" }],
    pan_no: [{ type: "required", message: "PAN No. is required" }],
    udyog_aadhaar: [{ type: "required", message: "Udyog Aadhar No. is required" },],
    udyog_aadhaar_document_url: [{ type: "required", message: "Udyog Aadhar is required" },],
    photo_id_proof_url: [{ type: "required", message: "Photo ID Proof is required" },],
    ssn: [{ type: "required", message: "SSN No. is required" }],
    business_description: [{ type: "required", message: "Business Description is required" }, ],
    shipping_service_type_id: [{ type: "required", message: "Shipping Service is required" },],
    iec_code: [{ type: "required", message: "IEC Code is required" }],
    file: [{ type: "required", message: "Upload your Resume as PDF or JPEG." }],

    // step -3 shipmentDetailsForm validators//
    nature_of_business_id: [{ type: "required", message: "Nature Of Business is required" }],
    shipment_frequency_id: [{ type: "required", message: "Shipment Frequency is required" }],
  };

  // step -1  userDetailsForm //
  userDetailsForm: FormGroup = this.fb.group(
    {
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      country_code: new FormControl(""),
      country_iso_code: new FormControl(""),
      phone: new FormControl("", [
        Validators.compose([
          Validators.required,
          Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
        ]),
      ]),
      phone_extension: new FormControl(""),
      company_name: new FormControl(""),
      address1: new FormControl(""),
      address2: new FormControl(""),
      country_id: new FormControl(null),
      zip_code: new FormControl(""),
      state_id: new FormControl(null),
      city: new FormControl(""),
      email: new FormControl("",[Validators.pattern(this.utilService._emialRegExp)]),
      password: new FormControl("",[Validators.minLength(8),PasswordStrengthValidator]),
      confirm_password: new FormControl("", [Validators.required]),
      isInvalidField: new FormControl(null)
    },
    {
      validators: this.password.bind(this),
    }
  );
  // step -2  companyDetailsForm //
  companyDetailsForm: FormGroup = this.fb.group({
    gst_exempted: new FormControl(""),
    gst_no: new FormControl(""),
    gst_document_url: new FormControl(""),
    pan_no: new FormControl(""),
    pan_document_url: new FormControl(""),
    udyog_aadhaar: new FormControl(""),
    udyog_aadhaar_document_url: new FormControl(""),
    photo_id_proof_url: new FormControl(""),
    ssn: new FormControl(""),
    business_description: new FormControl(""),
    shipping_service_type_id: new FormControl(""),
    iec_code: new FormControl(""),
    file: new FormControl(""),
  });
  // step -3  shipmentDetailsForm //
  shipmentDetailsForm: FormGroup = this.fb.group({
    nature_of_business_id: new FormControl(""),
    shipment_frequency_id: new FormControl(""),
    other_info: new FormControl(""),
  });
  
  ngOnInit(): void {
    this.getCountry();
    this.getshippingTypesData();
    this.getnatuerBusinessData();
    this.getshipmentFrequenciesData();
    this.userDetailsForm.get("email").valueChanges.subscribe((val: any) => {
      if(this.userDetailsForm.get("email").valid) {
        this.isViewEmailOTPVerification = false;  
      }else if(this.userDetailsForm.get("email").invalid){
        this.isSendOTPOnEmail = false;
        this.isEmailVerifiedIcon = false;
        this.isVerifyEmailMessage = false;
        this.isViewEmailOTPVerification = false; 
      }
     })
     this.userDetailsForm.get("phone").valueChanges.subscribe((val: any) => {
      if(val.length == 10 ){
        this.isSendPhoneOTP = true;
        this.isVerifyPhoneMessage = true;
        this.userDetailsForm.get("isInvalidField")?.setValidators([Validators.required]);
        this.userDetailsForm.get("isInvalidField")?.updateValueAndValidity();
      }
      if(val.length !== 10){
        this.isSendPhoneOTP = false;
        this.isPhoneVerifiedIcon = false;
        this.isVerifyPhoneMessage = false;
      }
      if(!this.userDetailsForm.get("phone").invalid) {
        this.isPhoneVerifiedIcon = false;
        this.isViewPhoneOTPVerification = false; 
      }
     })
  }
  //match confim_pass //
  public password(formGroup: FormGroup) {
    const { value: password } = formGroup.get("password");
    const { value: confirmPassword } = formGroup.get("confirm_password");
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }
  public getCountry() {
    this.subscription.push(
      this.authService.getCountryList().subscribe(
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
  public getshippingTypesData() {
    this.subscription.push(
      this.authService.getShippingTypesList().subscribe(
        (res: any) => {
          this.shippingTypesList = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }
  public getnatuerBusinessData() {
    this.subscription.push(
      this.authService.getNatuerBusinessList().subscribe(
        (res: any) => {
          this.natuerBusinessList = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }
  public getshipmentFrequenciesData() {
    this.subscription.push(
      this.authService.getShipmentFrequenciesList().subscribe(
        (res: any) => {
          this.shipmentFrequenciesList = res.data;
        },
        (error) => {
          if (error && error.error.errors && error.error.errors) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }
  public getStateDataById() {
    this.subscription.push(
      this.authService
        .getStateDataById(this.countryDataObj.country_id)
        .subscribe(
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
//Verify Phone Or Email//
// Verify Phone //
public sendOTPOnPhone() {
  this.isVerifyPhoneLoading = true;
  this.phoneCountDownTimer();
  this.userDetailsForm.markAllAsTouched();
    let basicFormDetail = this.userDetailsForm.value;
    this.phone = basicFormDetail.phone;
    let payloadObj: any = {};
    payloadObj.phone = this.phone;
    payloadObj.country_code = this.countryDataObj.country_code;
    this.authService.sendOTPOnPhoneOrEmail(payloadObj).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isViewPhoneOTPVerification = true;
          this.isVerifyPhoneLoading = false;
          this.isSendPhoneOTP = false;
          this.toastrService.success(res.message,'Success');
        }
      },
      (error) => {
        this.isVerifyPhoneLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          // this.toastrService.danger(error.error.errors.failed[0],'Error');
          this.toastrService.danger('Please select country.','Error');
        }
      }
    );
}

public onVerifyPhoneOTP() {
  if(!this.otpMessages){
    this.isOtpBlank = true;
    return
  }
  if(this.ngOtpInput.currentVal.length !== 6){
    this.isOtpBlank = true;
    return
  }
  this.isVerifyPhoneLoading = true;
    let OTP_Base64 = this.utilService.convertStringBase64(this.otpMessages);
    let payloadObj: any = {};
    payloadObj.phone = this.phone;
    payloadObj.country_code = this.countryDataObj.country_code;
    payloadObj.otp = OTP_Base64;
    this.authService.verifyPhoneOrEmailOTP(payloadObj).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.otpMessages = 0;
          this.isOtpBlank = false;
          this.isSendPhoneOTP = false;
          this.isPhoneVerifiedIcon = true;
          this.isVerifyPhoneMessage= false;
          this.isVerifyPhoneLoading = false;
          this.isViewPhoneOTPVerification = false;
          this.userDetailsForm.get("isInvalidField")?.clearValidators();
          this.userDetailsForm.get("isInvalidField")?.updateValueAndValidity();
          this.toastrService.success(res.message,'Success');
        }
      },
      (error) => {
        this.isVerifyPhoneLoading = false;
        this.isOtpBlank = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0],'Error');
        }
      }
    );
}

public phoneCountDownTimer() {
  this.phoneOTPResendTimer = 30;
  let x = setInterval(() => {
    this.phoneOTPResendTimer -= 1;
    if (this.phoneOTPResendTimer <= 0) {
      clearInterval(x);
      this.isVerifyPhoneLoading = false;
      this.isResendPhoneOTP = true;
    }
  }, 1000);
}

// Email //
public handleOtpChange(event: any) {
  this.OtpUpdate.next(event);
}
public setVal(val: any) {
  this.ngOtpInput.setValue(val);
}
public sendOTPOnEmail() {
  this.isVerifyEmailLoading = true;
  this.emailCountDownTime();
  this.userDetailsForm.markAllAsTouched();
  this.userDetailsForm.get('email')?.setValue((this.userDetailsForm.get('email')?.value? this.userDetailsForm.get('email')?.value: ' ').trim());
  if (this.userDetailsForm.get('email')?.value) {
    let basicFormDetail = this.userDetailsForm.value;
    this.email = basicFormDetail.email;
    let payloadObj: any = {};
    payloadObj.email = this.email
    this.authService.sendOTPOnPhoneOrEmail(payloadObj).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isSendOTPOnEmail = false;
          this.isVerifyEmailLoading = false;
          this.isViewEmailOTPVerification = true;
          this.userDetailsForm.get("email")?.setErrors({ invalid: true });
          this.toastrService.success(res.message, 'Success');
        }
      },
      (error) => {
        this.isSendOTPOnEmail = false;
        this.isVerifyEmailLoading = false;
        this.isViewEmailOTPVerification = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0]);
        }
      }
    );
  }
}

public onVerifyEmailOTP() {
  if(!this.otpMessages){
    this.isOtpBlank = true;
    return
  }
  if(this.ngOtpInput.currentVal.length !== 6){
    this.isOtpBlank = true;
    return
  }
  this.isVerifyEmailLoading = true;
  if (this.otpMessages) {
    let OTP_Base64 = this.utilService.convertStringBase64(this.otpMessages);
    let payloadObj: any = {};
    payloadObj.email = this.email;
    payloadObj.otp = OTP_Base64;
    this.authService.verifyPhoneOrEmailOTP(payloadObj).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.isOtpBlank = false;
          this.isSendOTPOnEmail = false;
          this.isStopVerifyEmail = true;
          this.isVerifyEmailMessage = false;
          this.isEmailVerifiedIcon = true;
          this.isVerifyEmailLoading = false;
          this.isViewEmailOTPVerification = false;
          this.userDetailsForm.get("email")?.setErrors({'firstError': null});
          this.userDetailsForm.get("email")?.updateValueAndValidity();
          this.toastrService.success(res.message, 'Success');
        }
      },
      (error) => {
        this.isSendOTPOnEmail = false;
        this.isVerifyEmailLoading = false;
        this.isVerifyEmailLoading = false;
        this.isViewEmailOTPVerification = false;
        this.isOtpBlank = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0],'Error');
        }
      }
    );
  } else {
    this.isOtpBlank = true;
  }
}
public emailCountDownTime() {
  this.emailOTPResendTimer = 30;
  let x = setInterval(() => {
    this.emailOTPResendTimer -= 1;
    if (this.emailOTPResendTimer <= 0) {
      clearInterval(x);
      this.isVerifyEmailLoading = false;
      this.isSendOTPOnEmail = false;
      this.isResendEmailOTP = true;
    }
  }, 1000);
}
//End Varify Phone or Email//

  public isHideShow() {
    this.showPassword = !this.showPassword;
  }
  public isHideShowConfirmPass() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  /*Upload File ot Image */
  public upload_GST_File() {
    this.getGSTFile.nativeElement.click();
    this.fileName = "GST";
  }
  public upload_PAN_File() {
    this.getPANFile.nativeElement.click();
    this.fileName = "PAN";
  }
  public uploadUdyogAdharFile() {
    this.getUdyogAdharFile.nativeElement.click();
    this.fileName = "Udyog_Adhar";
  }
  public uploadPhotoIdFile() {
    this.getPhotoFile.nativeElement.click();
    this.fileName = "Photo_Id";
  }
  public bytesToSize(bytes: any) {
    let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "n/a";
    this.extraa = Math.floor(Math.log(bytes) / Math.log(1024));
    if (this.extraa == 0) return bytes + " " + sizes[this.extraa];
    return (
      (bytes / Math.pow(1024, this.extraa)).toFixed(1) +
      " " +
      sizes[this.extraa]
    ); //
  }
  public fileChanged(event: any) {
    if (event.target.value.length != 0) {
      let fileSize = this.bytesToSize(event.target.files[0].size);
      let size: any = fileSize.split(" ");
      if (size > 24) {
        this.toastrService.success(
          "Please select file less than 24MB " + event.target.files[0].name,
          "Error"
        );
        return;
      }
      if (
        !this.utilService.checkFileUploadType(
          event.target.files[0],
          undefined,
          ["image/jpeg", "image/png", "application/pdf"]
        )
      ) {
        this.fileToUploadName = null;
        this.isWrongResumeUpload = true;
        return;
      } else {
        this.isWrongResumeUpload = false;
      }
      if (this.fileName == "GST") {
        this.fileObj.gstFile = Array.from(event.target.files);
        this.gstFileName = event.target.files[0].name;
      }
      if (this.fileName == "PAN") {
        this.fileObj.panFile = Array.from(event.target.files);
        this.panFileName = event.target.files[0].name;
      }
      if (this.fileName == "Udyog_Adhar") {
        this.fileObj.udyogAdharFile = Array.from(event.target.files);
        this.udyogAdharFileName = event.target.files[0].name;
      }
      if (this.fileName == "Photo_Id") {
        this.fileObj.photoIdFile = Array.from(event.target.files);
        this.photoIdFileName = event.target.files[0].name;
      }
    }
  }
  public removeIcon(type: any) {
    if (type == "GST") {
      this.gstFileName = "";
      this.companyDetailsForm.get("gst_document_url")?.setValue(null);
    }
    if (type == "PAN") {
      this.panFileName = "";
      this.companyDetailsForm.get("pan_document_url")?.setValue(null);
    }
    if (type == "Udyog_Adhar") {
      this.udyogAdharFileName = "";
      this.companyDetailsForm.get("udyog_aadhaar_document_url")?.setValue(null);
    }
    if (type == "Photo_Id") {
      this.photoIdFileName = "";
      this.companyDetailsForm.get("photo_id_proof_url")?.setValue(null);
    }
  }

  // get dropdown value //
  public selectCountryValue(country_val: any) {
    this.countryDataObj = country_val;
    this.getStateDataById();
    if (this.countryDataObj) {
      this.userDetailsForm.get("country_code").setValue(this.countryDataObj.country_code);
      if (this.countryDataObj.country_id == "233") {
        this.isUdyogAdhar = false;
        this.isRequiredField = false;
        this.selectValueObj.gst_exempted = false;
        this.isGSTExempted = false;
        this.companyDetailsForm.get("gst_no")?.clearValidators();
        this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();
        this.companyDetailsForm.get("gst_document_url")?.clearValidators();
        this.companyDetailsForm.get("gst_document_url")?.updateValueAndValidity();
        this.companyDetailsForm.get("pan_no")?.clearValidators();
        this.companyDetailsForm.get("pan_no")?.updateValueAndValidity();
        this.companyDetailsForm.get("pan_document_url")?.clearValidators();
        this.companyDetailsForm.get("pan_document_url")?.updateValueAndValidity();
        this.companyDetailsForm.get("udyog_aadhaar")?.clearValidators();
        this.companyDetailsForm.get("udyog_aadhaar")?.updateValueAndValidity();
        this.companyDetailsForm.get("udyog_aadhaar_document_url")?.clearValidators();
        this.companyDetailsForm.get("udyog_aadhaar_document_url") ?.updateValueAndValidity();
        this.companyDetailsForm.get("gst_exempted")?.clearValidators();
        this.companyDetailsForm.get("gst_exempted")?.updateValueAndValidity();
        this.companyDetailsForm.get("pan_no").setValue("");
        this.companyDetailsForm.get("udyog_aadhaar").setValue("");
        this.companyDetailsForm.get("gst_no").setValue("");
        this.userDetailsForm.get("state_id").setValue(null);
        this.companyDetailsForm.get("gst_exempted").setValue(null);

        this.fileObj.panFile = null;
        this.panFileName = "";
        this.fileObj.gstFile = null;
        this.gstFileName = "";
        this.fileObj.udyogAdharFile = null;
        this.udyogAdharFileName = "";
      }
      if (this.countryDataObj.country_id == "101") {
        this.isRequiredField = true;
        this.selectValueObj.gst_exempted = true;
        this.companyDetailsForm.get("gst_exempted").setValue(null);
        this.companyDetailsForm.get("gst_no")?.clearValidators();
        this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();
        this.companyDetailsForm.get("gst_document_url")?.clearValidators();
        this.companyDetailsForm.get("gst_document_url")?.updateValueAndValidity();
        this.companyDetailsForm.get("pan_no")?.setValidators([Validators.required]);
        this.companyDetailsForm.get("pan_no")?.updateValueAndValidity();
        this.companyDetailsForm.get("gst_exempted")?.setValidators([Validators.required]);
        this.companyDetailsForm.get("gst_exempted")?.updateValueAndValidity();
        this.userDetailsForm.get("state_id").setValue(null);
        this.fileObj.gstFile = null;
        this.gstFileName = "";
        this.companyDetailsForm.get("gst_document_url")?.setValue(null);
      }
      this.companyDetailsForm.updateValueAndValidity();
    }
  }

  public getGSTExemptedValue(gst_exempted_val: any) {
    if (gst_exempted_val == "1") {
      this.isUdyogAdhar = true;
      this.isGSTExempted = false;
      this.companyDetailsForm.get("gst_no")?.clearValidators();
      this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();
      this.companyDetailsForm.get("gst_document_url")?.clearValidators();
      this.companyDetailsForm.get("gst_document_url")?.updateValueAndValidity();
      this.companyDetailsForm.get("udyog_aadhaar")?.setValidators([Validators.required]);
      this.companyDetailsForm.get("udyog_aadhaar")?.updateValueAndValidity();
      this.companyDetailsForm.get("udyog_aadhaar_document_url")?.setValidators([Validators.required]);
      this.companyDetailsForm.get("udyog_aadhaar_document_url")?.updateValueAndValidity();
      this.companyDetailsForm.get("gst_no").setValue("");
      this.companyDetailsForm.get("gst_document_url")?.setValue(null);
      this.fileObj.gstFile = null;
      this.gstFileName = "";
    }
    if (gst_exempted_val == "0") {
      this.isGSTExempted = true;
      this.isUdyogAdhar = false;
      this.companyDetailsForm.get("udyog_aadhaar")?.clearValidators();
      this.companyDetailsForm.get("udyog_aadhaar")?.updateValueAndValidity();
      this.companyDetailsForm.get("udyog_aadhaar_document_url")?.clearValidators();
      this.companyDetailsForm.get("udyog_aadhaar_document_url")?.updateValueAndValidity();
      this.companyDetailsForm.get("gst_no")?.setValidators([Validators.required]);
      this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();
      this.companyDetailsForm.get("gst_document_url")?.setValidators([Validators.required]);
      this.companyDetailsForm.get("gst_document_url")?.updateValueAndValidity();
    }
    this.companyDetailsForm.get("udyog_aadhaar").setValue("");
    this.companyDetailsForm.get("udyog_aadhaar_document_url")?.setValue(null);
    this.fileObj.udyogAdharFile = null;
    this.udyogAdharFileName = "";
  }

  /*check Email and Phone Valid or Not*/
  public ngAfterViewInit(): void {
    fromEvent(this.inputEmail.nativeElement, "keyup")
      .pipe(
        filter(Boolean),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((text) => {
          if (this.userDetailsForm.get("email")?.valid) {
            this.isLoadingEmail = true;
            const payload = {
              email: this.utilService.convertStringBase64(
                this.inputEmail.nativeElement.value
              ),
            };
            if(this.isStopVerifyEmail){
               this.isLoadingEmail = false;
              return;
            }
            this.subscription.push(
              this.authService.onCheckUniqueEmailID(payload).subscribe(
                (res: any) => {
                  if (res.data) {
                    this.isExistingEmail = false;
                    this.isLoadingEmail = false;
                    this.isSendOTPOnEmail = true;
                    this.isVerifyEmailMessage = true;
                    this.userDetailsForm.get("email")?.setErrors({ invalid: true });
                  }
                },
                (error) => {
                  if (error && error.error.errors && error.error.errors) {
                    this.isLoadingEmail = false;
                    this.isExistingEmail = true;
                    this.isEmailVerifiedIcon = false;
                    this.isSendOTPOnEmail = false;
                    this.isVerifyEmailMessage = false;
                    this.userDetailsForm.get("email")?.setErrors({ invalid: true });
                  }
                }
              )
            );
          } else {
            this.isExistingEmail = false;
          }
        })
      )
      .subscribe((val: any) => {});
  }

  public next(formType: any) {
    if (formType == "user_details") {
      this.userDetailsForm.markAllAsTouched();
      if(this.isExistingEmail && this.isSendOTPOnEmail) {
        return;
      }
      if (this.isVerifyPhoneMessage) {
        return;
      }
      if (this.isVerifyEmailMessage) {
        return;
      }
      if (this.userDetailsForm.invalid) {
        return;
      }else{
        this.isEmailVerifiedIcon = true;
      }
    }
    if (formType == "company_details") {
      this.companyDetailsForm.markAllAsTouched();
    }
  }

  public onSubmit() {
    this.isLoading = true;
    this.shipmentDetailsForm.markAllAsTouched();
    if (this.shipmentDetailsForm.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj: any = {};
    payloadObj = Object.assign(
      this.userDetailsForm.value,
      this.shipmentDetailsForm.value,
      this.companyDetailsForm.value
    );
    payloadObj.gst_document_url = this.fileObj.gstFile;
    payloadObj.pan_document_url = this.fileObj.panFile;
    payloadObj.udyog_aadhaar_document_url = this.fileObj.udyogAdharFile;
    payloadObj.photo_id_proof_url = this.fileObj.photoIdFile;
    payloadObj.email = this.utilService.convertStringBase64(
      this.userDetailsForm.get("email")?.value
    );
    payloadObj.password = this.utilService.convertStringBase64(this.userDetailsForm.get("password")?.value);
    delete payloadObj.file;
    delete payloadObj.confirm_password;
    // console.log(payloadObj,'payloadObj======register');
    const fd: any = this.utilService.genrateFormData(payloadObj);
    this.subscription.push(
      this.authService.sendUserRegisterData(fd).subscribe((res: any) => {
          this.isLoading = false;
          this.toastrService.success(res.message, "Success");
          this.router.navigate(["auth/login"]);
        },(error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }
  public changeEmail(){
    this.isStopVerifyEmail = false;
    this.userDetailsForm.get("email")?.setValue(null)
    this.userDetailsForm.get("email")?.setValidators([Validators.required,Validators.pattern(this.utilService._emialRegExp)])
    this.isExistingEmail = false;
    this.isSendOTPOnEmail = false;
    this.isEmailVerifiedIcon = false;
    this.isVerifyEmailLoading = false;
    this.isVerifyEmailMessage = false;
    this.isViewEmailOTPVerification = false;

  }
  public redirecToSign() {
    this.router.navigate(["auth/login"]);
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }
}
