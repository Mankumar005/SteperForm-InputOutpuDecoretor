import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilService } from '../../shared/common- services/util.service';
import { NbToastrService } from '@nebular/theme';
import { ProfileService } from '../../shared/component-services/profile.service';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { registerService } from '../../shared/auth-services/auth-component-services/register-service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public subscription: Subscription[] = [];

  public countryList: Array<any> = [];
  public stateList: Array<any> = [];
  public shippingTypesList: Array<any> = [];
  public natuerBusinessList: Array<any> = [];
  public shipmentFrequenciesList: Array<any> = [];

  public profileDetials: any = {};
  public selectValueObj: any = {};
  public countryDataObj: any = {};

  public userId: any = null;
  public userRole:any = null;

  public isLoading : boolean =  false;
  public isEditProfile: boolean = false;
  public isLoadingEmail: boolean = false;
  public isExistingEmail: boolean = false;
  public isSelectCountry: boolean = false;
  public isGSTExempted: boolean = false;
  public isRequiredField: boolean = false;
  public isUdyogAdhar: boolean = false;

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
    userDetailsForm = this.fb.group({
        first_name: new FormControl(""),
        last_name: new FormControl(""),
        country_code: new FormControl(""),
        country_iso_code: new FormControl(""),
        phone: new FormControl(""),
        phone_extension: new FormControl(""),
        company_name: new FormControl(""),
        address1: new FormControl(""),
        address2: new FormControl(""),
        country_id: new FormControl(null),
        zip_code: new FormControl(""),
        state_id: new FormControl(null),
        city: new FormControl(""),
        email: new FormControl(""),
      }
      
    );
    // step -2  companyDetailsForm //
    companyDetailsForm = this.fb.group({
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
    shipmentDetailsForm = this.fb.group({
      nature_of_business_id: new FormControl(""),
      shipment_frequency_id: new FormControl(""),
      other_info: new FormControl(""),
    });

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public profileService: ProfileService,
    public authService: registerService,
    public router: Router,
    private toastrService: NbToastrService,
    private jwtHelper: JwtHelperService
  
  )
  {
    this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
  }

  ngOnInit(): void {
    this.getProfileDataById()
    this.getCountry();
    this.getshippingTypesData();
    this.getnatuerBusinessData();
    this.getshipmentFrequenciesData();
  }

  public onEditProfile(){
    this.isEditProfile = true;
    if(this.isEditProfile){
      this.userDetailsForm.patchValue(this.profileDetials)
      this.countryDataObj.country_id = this.profileDetials.country_id
      if (this.profileDetials.country_id == "233") {
        this.isUdyogAdhar = false;
        this.isRequiredField = false;
        this.selectValueObj.gst_exempted = false;
        this.isGSTExempted = false;
        this.companyDetailsForm.get("gst_no")?.clearValidators();
        this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();

        this.companyDetailsForm.get("pan_no")?.clearValidators();
        this.companyDetailsForm.get("pan_no")?.updateValueAndValidity();

        this.companyDetailsForm.get("udyog_aadhaar")?.clearValidators();
        this.companyDetailsForm.get("udyog_aadhaar")?.updateValueAndValidity();

        this.companyDetailsForm.get("gst_exempted")?.clearValidators();
        this.companyDetailsForm.get("gst_exempted")?.updateValueAndValidity();
  
      } 
      if (this.profileDetials.country_id == "101") {
        this.isRequiredField = true;
        this.selectValueObj.gst_exempted = true;
        this.companyDetailsForm.get("gst_exempted").setValue(null);

        this.companyDetailsForm.get("gst_no")?.clearValidators();
        this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();

        this.companyDetailsForm.get("pan_no")?.setValidators([Validators.required]);
        this.companyDetailsForm.get("pan_no")?.updateValueAndValidity();

        this.companyDetailsForm.get("gst_exempted")?.setValidators([Validators.required]);
        this.companyDetailsForm.get("gst_exempted")?.updateValueAndValidity();

        this.companyDetailsForm.updateValueAndValidity();

      }
      let cuntryObj =  this.countryList.filter((value:any) => {
        return value.country_id == this.profileDetials.country_id
      })
      if(this.userRole.role == 'CUSTOMER'){
        this.userDetailsForm.get("country_code").setValue(cuntryObj[0].country_iso_code);
        this.getStateDataById()
      }
    }
    if(this.isEditProfile){
      this.companyDetailsForm.patchValue(this.profileDetials)
      this.getGSTExemptedValue(this.profileDetials.gst_exempted)
    }
    if(this.isEditProfile){
      this.shipmentDetailsForm.patchValue(this.profileDetials)
    }
  }

  public getProfileDataById() {
    this.isLoading = true;
    this.subscription.push(this.profileService.getProfileDetailsById().subscribe((res: any) => {
          this.profileDetials = res.data;
          //basic detials //
          this.profileDetials.name = res.data?.first_name + " " + res.data?.last_name;
          this.profileDetials.phone_extension =res.data?.customer?.phone_extension;
          this.profileDetials.address1 = res.data?.customer?.address1;
          this.profileDetials.address2 = res.data?.customer?.address2;
          this.profileDetials.zip_code = res.data?.customer?.zip_code;
          this.profileDetials.country = res.data?.customer?.country?.country_name;
          this.profileDetials.country_id = res.data?.customer?.country_id;
          this.profileDetials.state = res.data?.customer?.state?.state_name;
          this.profileDetials.state_id = res.data?.customer?.state_id;
          this.profileDetials.city = res.data?.customer?.city;
          this.profileDetials.rejected_reson = res.data?.customer?.rejected_reson;
          //company details//
          this.profileDetials.company_name = res.data?.customer?.company_name;
          this.profileDetials.gst_exempted = res.data?.customer_company_detail?.gst_exempted;
          this.profileDetials.gst_no = res.data?.customer_company_detail?.gst_no;
          this.profileDetials.pan_no = res.data?.customer_company_detail?.pan_no;
          this.profileDetials.udyog_aadhaar = res.data?.customer_company_detail?.udyog_aadhaar;
          this.profileDetials.ssn = res.data?.customer_company_detail?.ssn;
          this.profileDetials.iec_code = res.data?.customer_company_detail?.iec_code;
          this.profileDetials.shipping_service = res.data?.customer_company_detail?.shipping_service_type?.shipping_service_type_name;
          this.profileDetials.shipping_service_type_id = res.data?.customer_company_detail?.shipping_service_type_id;
          this.profileDetials.business_description = res.data?.customer_company_detail?.business_description;
          //shipment details//
          this.profileDetials.business_name = res.data?.customer_shipment_detail?.nature_of_business?.business_name;
          this.profileDetials.nature_of_business_id = res.data?.customer_shipment_detail?.nature_of_business?.nature_of_business_id;
          this.profileDetials.frequency_name = res.data?.customer_shipment_detail?.shipment_frequency?.name;
          this.profileDetials.shipment_frequency_id = res.data?.customer_shipment_detail?.shipment_frequency?.shipment_frequency_id;
          this.profileDetials.other_info = res.data?.customer_shipment_detail?.other_info;
          this.isLoading = false;
         },(error:any) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
    ));
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

        this.companyDetailsForm.get("pan_no")?.clearValidators();
        this.companyDetailsForm.get("pan_no")?.updateValueAndValidity();

        this.companyDetailsForm.get("udyog_aadhaar")?.clearValidators();
        this.companyDetailsForm.get("udyog_aadhaar")?.updateValueAndValidity();

        this.companyDetailsForm.get("gst_exempted")?.clearValidators();
        this.companyDetailsForm.get("gst_exempted")?.updateValueAndValidity();

        this.companyDetailsForm.get("pan_no").setValue("");

        this.companyDetailsForm.get("udyog_aadhaar").setValue("");
        this.companyDetailsForm.get("gst_no").setValue("");
        this.userDetailsForm.get("state_id").setValue(null);
        this.companyDetailsForm.get("gst_exempted").setValue(null);
      }
      if (this.countryDataObj.country_id == "101") {
        this.isRequiredField = true;
        this.selectValueObj.gst_exempted = true;
        this.companyDetailsForm.get("gst_exempted").setValue(null);

        this.companyDetailsForm.get("gst_no")?.clearValidators();
        this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();

        this.companyDetailsForm.get("pan_no")?.setValidators([Validators.required]);
        this.companyDetailsForm.get("pan_no")?.updateValueAndValidity();

        this.companyDetailsForm.get("gst_exempted")?.setValidators([Validators.required]);
        this.companyDetailsForm.get("gst_exempted")?.updateValueAndValidity();

        this.userDetailsForm.get("state_id").setValue(null);
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

      this.companyDetailsForm.get("udyog_aadhaar")?.setValidators([Validators.required]);
      this.companyDetailsForm.get("udyog_aadhaar")?.updateValueAndValidity();

      this.companyDetailsForm.get("gst_no").setValue("");
  
    }
    if (gst_exempted_val == "0") {
      this.isGSTExempted = true;
      this.isUdyogAdhar = false;
      this.companyDetailsForm.get("udyog_aadhaar")?.clearValidators();
      this.companyDetailsForm.get("udyog_aadhaar")?.updateValueAndValidity();

      this.companyDetailsForm.get("gst_no")?.setValidators([Validators.required]);
      this.companyDetailsForm.get("gst_no")?.updateValueAndValidity();

      this.companyDetailsForm.get("udyog_aadhaar").setValue("");

    }
  }

  public onSubmit() {
    this.isLoading = true;
    this.userDetailsForm.markAllAsTouched();
    if (this.userDetailsForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.companyDetailsForm.markAllAsTouched();
    if (this.companyDetailsForm.invalid) {
      this.isLoading = false;
      return;
    }

    let payloadObj: any = {};
    if(this.userRole.role == 'ADMIN'){
      payloadObj = this.userDetailsForm.value
      delete payloadObj.country_code
      delete payloadObj.country_iso_code
      delete payloadObj.company_name
      delete payloadObj.address1
      delete payloadObj.address2
      delete payloadObj.country_id 
      delete payloadObj.zip_code
      delete payloadObj.state_id 
      delete payloadObj.city
      delete payloadObj.phone_extension
    }else if(this.userRole.role == 'CUSTOMER'){
      payloadObj = Object.assign(
        this.userDetailsForm.value,
        this.shipmentDetailsForm.value,
        this.companyDetailsForm.value
      );
    }
    const fd: any = this.utilService.genrateFormData(payloadObj);
    this.subscription.push(
      this.profileService.onUpdateProfileData(fd).subscribe((res: any) => {
          this.isLoading = false;
          this.toastrService.success(res.message, "Success");
          this.isEditProfile = false;
          this.userDetailsForm.reset()
          this.companyDetailsForm.reset()
          this.shipmentDetailsForm.reset()
          this.getProfileDataById()
        },(error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

public back() {
   this.isEditProfile = false;
   this.getProfileDataById()
}
public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}    
}
