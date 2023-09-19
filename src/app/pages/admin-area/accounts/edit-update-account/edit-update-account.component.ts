import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
 
import { NbToastrService } from '@nebular/theme';
 
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
 
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../../shared/common- services/util.service';
import { ProfileService } from '../../../../shared/component-services/profile.service';
import { registerService } from '../../../../shared/auth-services/auth-component-services/register-service';
import { AccountService } from '../../../../shared/component-services/admin-area.services.ts/accounts.service';

@Component({
  selector: 'ngx-edit-update-account',
  templateUrl: './edit-update-account.component.html',
  styleUrls: ['./edit-update-account.component.scss']
})
export class EditUpdateAccountComponent implements OnInit, OnDestroy {
    public subscription: Subscription[] = [];
  
    @ViewChild("getGSTFile") public getGSTFile: any;
    @ViewChild("getPANFile") public getPANFile: any;
    @ViewChild("getUdyogAdharFile") public getUdyogAdharFile: any;
    @ViewChild("getPhotoFile") public getPhotoFile: any;
   
    public fileToUploadName: any = "";
    public fileName: any = "";
    public gstFileName: any = "";
    public panFileName: any = "";
    public photoIdFileName: any = "";
    public udyogAdharFileName: any = "";
  
    public countryList: Array<any> = [];
    public stateList: Array<any> = [];
    public shippingTypesList: Array<any> = [];
    public natuerBusinessList: Array<any> = [];
    public shipmentFrequenciesList: Array<any> = [];
  
    public fileObj: any = {};
    public selectValueObj: any = {};
    public countryDataObj: any = {};
    public accountDetials: any ;
  
    public userId: any = null;
    public userRole:any = null;
  
    public isLoading : boolean =  false;
    public isSelectCountry: boolean = false;
    public isGSTExempted: boolean = false;
    public isRequiredField: boolean = false;
    public isUdyogAdhar: boolean = false;
    public isWrongResumeUpload: boolean = false;
  
    public extraa: any;
  
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
 
      // step -3 shipmentDetailsForm validators//
      nature_of_business_id: [{ type: "required", message: "Nature Of Business is required" }],
      shipment_frequency_id: [{ type: "required", message: "Shipment Frequency is required" }],
    };
  
  // step -1  userDetailsForm //
  userDetailsForm = this.fb.group(
    {
      first_name: new FormControl(""),
      last_name: new FormControl(""),
      country_code: new FormControl(""),
      country_iso_code: new FormControl(""),
      phone: new FormControl(""),
      email: new FormControl(""),
      phone_extension: new FormControl(""),
      company_name: new FormControl(""),
      address1: new FormControl(""),
      address2: new FormControl(""),
      country_id: new FormControl(null),
      zip_code: new FormControl(""),
      state_id: new FormControl(null),
      city: new FormControl(""),
 
    });
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
      public accountService: AccountService,
      public authService: registerService,
      public route:ActivatedRoute,
      public router: Router,
      private toastrService: NbToastrService,
      private jwtHelper: JwtHelperService
    
    )
    {
      this.route.queryParams.subscribe((params: any) => {
        this.userId = atob(params.user_id); 
        if (this.userId) {
        }
      });
      this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    }
  
    ngOnInit(): void {
      this.getCountry();
      this.getshippingTypesData();
      this.getnatuerBusinessData();
      this.getshipmentFrequenciesData();
      this.getAccountDataById();
    }

    public getAccountDataById() {
      this.isLoading = true;
      this.subscription.push(this.accountService.getApprovedAndPendingAccountDetailsById(this.userId).subscribe((res: any) => {
           this.accountDetials = res.data;
            //basic detials //
            this.accountDetials.name = res.data?.first_name + " " + res.data?.last_name;
            this.accountDetials.phone_extension =res.data?.customer?.phone_extension;
            this.accountDetials.address1 = res.data?.customer?.address1;
            this.accountDetials.address2 = res.data?.customer?.address2;
            this.accountDetials.zip_code = res.data?.customer?.zip_code;
            this.accountDetials.country = res.data?.customer?.country?.country_name;
            this.accountDetials.country_code = res.data?.customer?.country?.country_code;
            this.accountDetials.country_iso_code = res.data?.customer?.country?.country_iso_code;
            this.accountDetials.country_id = res.data?.customer?.country_id;
            this.accountDetials.state = res.data?.customer?.state?.state_name;
            this.accountDetials.state_id = res.data?.customer?.state_id;
            this.accountDetials.city = res.data?.customer?.city;
            this.accountDetials.rejected_reson = res.data?.customer?.rejected_reson;
            //company details//
            this.accountDetials.company_name = res.data?.customer?.company_name;
            this.accountDetials.gst_exempted = res.data?.customer_company_detail?.gst_exempted;
            this.accountDetials.gst_no = res.data?.customer_company_detail?.gst_no;
            this.accountDetials.pan_no = res.data?.customer_company_detail?.pan_no;
            this.accountDetials.udyog_aadhaar = res.data?.customer_company_detail?.udyog_aadhaar;
            this.accountDetials.ssn = res.data?.customer_company_detail?.ssn;
            this.accountDetials.iec_code = res.data?.customer_company_detail?.iec_code;
            this.accountDetials.shipping_service = res.data?.customer_company_detail?.shipping_service_type?.shipping_service_type_name;
            this.accountDetials.shipping_service_type_id = res.data?.customer_company_detail?.shipping_service_type_id;
            this.accountDetials.business_description = res.data?.customer_company_detail?.business_description;
            this.accountDetials.gst_document_url_name = res.data?.customer_company_detail?.gst_document_file_name;
            this.accountDetials.pan_document_url_name = res.data?.customer_company_detail?.pan_document_file_name;
            this.accountDetials.udyog_aadhaar_document_url_name = res.data?.customer_company_detail?.udyog_aadhaar_document_file_name;
            this.accountDetials.photo_id_proof_url_name = res.data?.customer_company_detail?.photo_id_proof_file_name;
            // this.accountDetials.photo_id_proof_url_name = res.data?.customer_company_detail?.photo_id_proof_url.match(/.*\/(.*)$/)[1];
            //shipment details//
            this.accountDetials.business_name = res.data?.customer_shipment_detail?.nature_of_business?.business_name;
            this.accountDetials.nature_of_business_id = res.data?.customer_shipment_detail?.nature_of_business?.nature_of_business_id;
            this.accountDetials.frequency_name = res.data?.customer_shipment_detail?.shipment_frequency?.name;
            this.accountDetials.shipment_frequency_id = res.data?.customer_shipment_detail?.shipment_frequency?.shipment_frequency_id;
            this.accountDetials.other_info = res.data?.customer_shipment_detail?.other_info;
            this.isLoading = false;
            this.setValue()
           },
          (error) => {
            this.isLoading = false;
            if (error && error.error.errors && error.error.errors.failed) {
              this.toastrService.danger(error.error.errors.failed[0], "Error");
            }
          }
      ));
    }

    public setValue(){
      if(this.accountDetials){
        this.countryDataObj.country_id = this.accountDetials.country_id;
        if (this.accountDetials.country_id == "233") {
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
        if (this.accountDetials.country_id == "101") {
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
          // setValue on userDetailsForm //
          this.userDetailsForm.patchValue(this.accountDetials);

          // setValue on companyDetailsForm //
          this.companyDetailsForm.patchValue(this.accountDetials)
          this.getGSTExemptedValue(this.accountDetials.gst_exempted)
          this.companyDetailsForm.get("udyog_aadhaar").setValue(this.accountDetials.udyog_aadhaar);
          if(this.accountDetials.gst_document_url_name){
            this.gstFileName = this.accountDetials.gst_document_url_name;  
          }  
          if(this.accountDetials.pan_document_url_name){
            this.panFileName = this.accountDetials.pan_document_url_name;
          }
          if(this.accountDetials.udyog_aadhaar_document_url_name){
            this.udyogAdharFileName = this.accountDetials.udyog_aadhaar_document_url_name;
          }
          if(this.accountDetials.photo_id_proof_url_name){
            this.photoIdFileName = this.accountDetials.photo_id_proof_url_name;
          }

          // setValue on shipmentDetailsForm //
          this.shipmentDetailsForm.patchValue(this.accountDetials)

          this.getStateDataById(this.accountDetials.country_id)
          this.userDetailsForm.get("state_id").setValue(this.accountDetials.state_id);
      }
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
    public getStateDataById(country_id:any) {
      this.subscription.push(
        this.authService
          .getStateDataById(country_id)
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
    
    //download Image //
    downloadImages(url: any, name: any) {
      fetch(url)
        .then((resp) => resp.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(() => console.log("An error sorry"));
    }

    // get dropdown value //
    public selectCountryValue(country_val: any) {
      this.countryDataObj = country_val;
      this.getStateDataById(this.countryDataObj.country_id);
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
  
    public onSubmit() {
      if(this.gstFileName){
        this.companyDetailsForm.get("gst_document_url")?.clearValidators();
        this.companyDetailsForm.get("gst_document_url")?.updateValueAndValidity();  
      } 
      if(this.panFileName){
        this.companyDetailsForm.get("pan_document_url")?.clearValidators();
        this.companyDetailsForm.get("pan_document_url")?.updateValueAndValidity();
      } 
      if(this.udyogAdharFileName){
        this.companyDetailsForm.get("udyog_aadhaar_document_url")?.clearValidators();
        this.companyDetailsForm.get("udyog_aadhaar_document_url")?.updateValueAndValidity();
      } 
      if(this.photoIdFileName){
        this.companyDetailsForm.get("photo_id_proof_url")?.clearValidators();
        this.companyDetailsForm.get("photo_id_proof_url")?.updateValueAndValidity();
      } 
      if(this.countryDataObj){
        let cuntryObj =  this.countryList.filter((value:any) => {
          return value.country_id == this.countryDataObj.country_id
        })
        this.userDetailsForm.get("country_code").setValue(cuntryObj[0].country_code);
        this.userDetailsForm.get("country_iso_code").setValue(cuntryObj[0].country_iso_code);
      }else {
        this.userDetailsForm.get("country_code").setValue(this.accountDetials.country_code);
        this.userDetailsForm.get("country_iso_code").setValue(this.accountDetials.country_iso_code);
      }
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
        payloadObj = Object.assign(
          this.userDetailsForm.value,
          this.shipmentDetailsForm.value,
          this.companyDetailsForm.value
        );
        payloadObj.user_id = this.userId;
        if( this.fileObj.gstFile){
          payloadObj.gst_document_url = this.fileObj.gstFile;
        }else{
          payloadObj.gst_document_url = "";
        }
        if(this.fileObj.panFile){
          payloadObj.pan_document_url = this.fileObj.panFile;
        }else{
           payloadObj.pan_document_url = "";
        }
        if(this.fileObj.udyogAdharFile){
          payloadObj.udyog_aadhaar_document_url = this.fileObj.udyogAdharFile;
        }else{
           payloadObj.udyog_aadhaar_document_url = "";
        }
        if(this.fileObj.photoIdFile){
          payloadObj.photo_id_proof_url = this.fileObj.photoIdFile;
        }else{
           payloadObj.photo_id_proof_url = "";
        }
      // console.log(payloadObj);
      const fd: any = this.utilService.genrateFormData(payloadObj);
      this.subscription.push(
        this.accountService.userAccountUpdate(fd).subscribe((res: any) => {
            this.isLoading = false;
            this.toastrService.success(res.message, "Success");
            this.accountDetials = false;
            this.userDetailsForm.reset()
            this.companyDetailsForm.reset()
            this.shipmentDetailsForm.reset()
            this.router.navigate(["pages/admin-area/accounts/account-details"],{ queryParams: {user_id : btoa(this.userId), account_type : 'pending'}});
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
    this.router.navigate(["pages/admin-area/accounts/account-details"], { queryParams: {user_id : btoa(this.userId) ,account_type : 'pending'}});
  }
  public ngOnDestroy() {
      this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }    
  }
  