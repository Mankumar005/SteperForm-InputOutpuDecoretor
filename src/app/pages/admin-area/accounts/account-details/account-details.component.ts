import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { UtilService } from "../../../../shared/common- services/util.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { AccountService } from "../../../../shared/component-services/admin-area.services.ts/accounts.service";
import { ConfirmModalComponent } from "../../../../shared/modal-services/confirm-modal/confirm-modal.component";
import { Subscription } from "rxjs";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { PasswordStrengthValidator } from "../../../../shared/custom-validator/password.validator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CustomerService } from "../../../../shared/component-services/admin-area.services.ts/customer.service";
import * as moment from "moment";
@Component({
  selector: "ngx-account-details",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./account-details.component.html",
  styleUrls: ["./account-details.component.scss"],
})
export class AccountDetailsComponent implements OnInit, OnDestroy,AfterViewChecked {
  public subscription: Subscription[] = [];
  public customerTierValue: Array <any> = [];
  public paymentModeList: Array <any> = [];
  public wallateLadgerList: Array <any> = [];
  public accountDetials: any = {};
  public walletCurrentBalance: any = {};

  public accountType: any = null;
  public userId: any = null;
  public parentId: any = null;
  public userAuthAccess: any = null;
  public actionTypes: any = null;
  public confirmValue: any = null;
  public userRole :any = null;
  public backTo :any = null;

  public source: LocalDataSource = new LocalDataSource();
  public inwardSource: LocalDataSource = new LocalDataSource();
  public outwardSource: LocalDataSource = new LocalDataSource();
 
  public pageSize: number = 10;
  public currentPage: number = 1;
  public showPerPage: number = 10;

  public isLoading: boolean = false;
  public showPassword: boolean = false;
  public isActiveDeactive: boolean = false;
  public isAprrove: boolean = false;
  public isReject: boolean = false;
  public setActiveAccountDetails : boolean = false;
  public setActiveSubAccount: boolean = false;
  public setWalletSubAccount: boolean = false;

  inward_settings = {
    actions:false,
    mode: 'external', 
    pager:{
      display: true,
      perPage: this.showPerPage,
    },
    columns: {
      index:{
        title: 'No',
        type: 'string',
        filter:false,
        sort: false,
        valuePrepareFunction : (val,row,cell)=>{
          const pager = this.inwardSource.getPaging();
          const ret = (pager.page-1) * pager.perPage + cell.row.index+1;
          return ret;
       }
      },
      payment_mode_type_name: {
        title: 'Payment Mode',
        type: 'string',
      },
      amount: {
        title: 'Amount',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      created_at: {
        title: 'Date',
        type: 'string',
      }
    }
  };
  outward_settings = {
    actions:false,
    mode: 'external', 
    pager:{
      display: true,
      perPage: this.showPerPage,
    },
    columns: {
      index:{
        title: 'No',
        type: 'string',
        filter:false,
        sort: false,
        valuePrepareFunction : (val,row,cell)=>{
          const pager = this.outwardSource.getPaging();
          const ret = (pager.page-1) * pager.perPage + cell.row.index+1;
          return ret;
       }
      },
      order_no: {
        title: 'Order No',
        type: 'string',
      },
      payment_mode_type_name: {
        title: 'Payment Mode',
        type: 'string',
      },
      amount: {
        title: 'Amount',
        type: 'string',
      },
      created_at: {
        title: 'Date',
        type: 'string',
      }
    }
  };
  constructor(
    private readonly changeDetection: ChangeDetectorRef,
    public customerService: CustomerService,
    public accountService: AccountService,
    public utilService: UtilService,
    public fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private jwtHelper: JwtHelperService
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.userId = atob(params.user_id); 
      this.backTo = params.back_to;
      this.accountType = params.account_type;
      if (this.userId) {
        this.getAccountDataById();
      } else {
        this.accountDetials = null;
        this.isActiveDeactive = true;
      }
    });
    this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    // console.log(this.userRole,'userRole======');
    }
  
  public formValidations: any = {
    new_password: [{ type: 'required', message: ' New Password is required' }],
    customer_tier_id: [{ type: 'required', message: 'Customer Tier is required' }],
    amount: [{ type: "required", message: "Amount is required" }],
    wallet_payment_mode_id: [{ type: "required", message: "Payment Mode is required" }],
    description: [{ type: "required", message: "Description is required" }],
  };
  customerWalletFrom = this.fb.group({
    amount: new FormControl(""),
    wallet_payment_mode_id: new FormControl(""),
    description: new FormControl(""),
  });
  cutomerTierForm = this.fb.group({
    customer_tier_id: new FormControl('', [Validators.required])
  })
  resetPaswordForm = this.fb.group({
    new_password: new FormControl('', [Validators.minLength(8), PasswordStrengthValidator])
  })

  ngOnInit(): void {
    this.getCustomerTireData()
    if(this.backTo == 'sub_account'){
      this.setActivateTab()
    }
  }
  public decimalFilter(event: any) {
    const reg = /^[1-9]\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    if (!reg.test(input)) {
        event.preventDefault();
    }
 }
  public getWalletLadgerData(transection_type:any) {
    let payloadObj:any = {};
    // payloadObj.customer_id = '148'
    payloadObj.customer_id = this.accountDetials.customer_id
    payloadObj.transection_type = transection_type
    this.subscription.push(this.customerService.getCustomerLeserData(payloadObj).subscribe((res: any) => {
      this.wallateLadgerList = res.data
      if(transection_type === 'inward'){
        this.wallateLadgerList.forEach((el:any)=>{
          el.payment_mode_type_name = el.wallet_payment_mode_name;
          el.created_at = moment.utc(el?.created_at).local().format("DD-MM-YYYY hh:mm A");
        })
      this.inwardSource.load(this.wallateLadgerList)
      }else if(transection_type === 'outward'){
        this.wallateLadgerList.forEach((el:any)=>{
          el.payment_mode_type_name = el.shipment_transaction.payment_mode;
          el.order_no = el.shipment_booking.booking_no;
          el.created_at = moment.utc(el?.shipment_transaction.date).local().format("DD-MM-YYYY hh:mm A");
        })
      this.outwardSource.load(this.wallateLadgerList)
      }
        // console.log(this.wallateLadgerList);
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        // this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getCustomerBalanceData() {
    this.subscription.push(this.customerService.getcustomerBalanceData(this.accountDetials.customer_id).subscribe((res: any) => {
      this.walletCurrentBalance = res.data
    }, error => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        // this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getPaymentModeData() {
    this.subscription.push(this.customerService.getPaymentModeData().subscribe((res: any) => {
      this.paymentModeList = res.data
      
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getCustomerTireData() {
    this.subscription.push(this.accountService.getCustomerTierData().subscribe((res: any) => {
      this.customerTierValue = res.data
    }, error => {
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], 'Error');
      }
    }))
  }
  public getAccountDataById() {
    this.isLoading = true;
    this.subscription.push(this.accountService.getApprovedAndPendingAccountDetailsById(this.userId).subscribe((res: any) => {
      if (res.data.is_active) {
            this.isActiveDeactive = true;
            this.actionTypes = "active";
          } else {
            this.isActiveDeactive = false;
          }
          if (res.data.is_approved == "1") {
            this.isAprrove = true;
            this.isReject = false;
          }
          if (res.data.is_approved == "2") {
            this.isReject = true;
            this.isAprrove = false;
          }
          this.accountDetials = res.data;
          //basic detials //
          this.accountDetials.name = res.data?.first_name + " " + res.data?.last_name;
          this.accountDetials.phone_extension =res.data?.customer?.phone_extension;
          this.accountDetials.address1 = res.data?.customer?.address1;
          this.accountDetials.address2 = res.data?.customer?.address2;
          this.accountDetials.zip_code = res.data?.customer?.zip_code;
          this.accountDetials.country = res.data?.customer?.country?.country_name;
          this.accountDetials.state = res.data?.customer?.state?.state_name;
          this.accountDetials.city = res.data?.customer?.city;
          this.accountDetials.rejected_reson = res.data?.customer?.rejected_reson;
          this.accountDetials.customer_id = res.data?.customer?.customer_id;
          //company details//
          this.accountDetials.company_name = res.data?.customer?.company_name;
          this.accountDetials.gst_no = res.data?.customer_company_detail?.gst_no;
          this.accountDetials.pan_no = res.data?.customer_company_detail?.pan_no;
          this.accountDetials.udyog_aadhaar = res.data?.customer_company_detail?.udyog_aadhaar;
          this.accountDetials.ssn_no = res.data?.customer_company_detail?.ssn;
          this.accountDetials.iec_no = res.data?.customer_company_detail?.iec_code;
          this.accountDetials.shipping_service = res.data?.customer_company_detail?.shipping_service_type?.shipping_service_type_name;
          this.accountDetials.business_description = res.data?.customer_company_detail?.business_description;
          this.accountDetials.gst_document_url = res.data?.customer_company_detail?.gst_document_url;
          this.accountDetials.pan_document_url = res.data?.customer_company_detail?.pan_document_url;
          this.accountDetials.udyog_aadhaar_document_url = res.data?.customer_company_detail?.udyog_aadhaar_document_url;
          this.accountDetials.photo_id_proof_url = res.data?.customer_company_detail?.photo_id_proof_url;
          this.accountDetials.gst_document_url_name = res.data?.customer_company_detail?.gst_document_file_name;
          this.accountDetials.pan_document_url_name = res.data?.customer_company_detail?.pan_document_file_name;
          this.accountDetials.udyog_aadhaar_document_url_name = res.data?.customer_company_detail?.udyog_aadhaar_document_file_name;
          this.accountDetials.photo_id_proof_url_name = res.data?.customer_company_detail?.photo_id_proof_file_name;
          //shipment details//
          this.accountDetials.business_name = res.data?.customer_shipment_detail?.nature_of_business?.business_name;
          this.accountDetials.frequency_name = res.data?.customer_shipment_detail?.shipment_frequency?.name;
          this.accountDetials.other_info = res.data?.customer_shipment_detail?.other_info;
          // console.log(this.accountDetials, " this.accountDetials---");
          this.isLoading = false;
          if(this.accountType == 'approved'){
            this.getPaymentModeData()
            this.getCustomerBalanceData()
            this.getWalletLadgerData('inward')
        }
         },
        (error) => {
          this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            if(this.accountType === 'approved') {
              this.router.navigate(["pages/admin-area/accounts/approved-account"]);
            } else {
              this.router.navigate(["pages/admin-area/accounts/pending-account"]);
            }
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
    ));
  }
  public getLadgerEvent(event:any){
    if(event.tabTitle == 'Inward'){
      this.getWalletLadgerData('inward')
      this.getCustomerBalanceData()
    }else if(event.tabTitle == 'Outward'){
      this.getCustomerBalanceData()
      this.getWalletLadgerData('outward')
    }
    
  }
  // account active  & deactive //
  public toggleTempHolder(event: any) { 
    if (event) {
      this.onConfirmActiveDeactiveAccount();
      this.actionTypes = "active";
    } else {
      this.onConfirmActiveDeactiveAccount();
      this.actionTypes = "inactive";
    }
  }
  public onConfirmActiveDeactiveAccount() {
    let data: any = {};
    data.message =
      this.accountDetials.is_active == "0" ? "Are you sure want to Active Account?" : "Are you sure want to Deactivate Account?";
    this.dialogService.open(ConfirmModalComponent, {
        context: {
          data: data,
        },
      })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          this.onActiveDeactiveAndApproveRejectAccountd();
        } else {
          this.isActiveDeactive = this.accountDetials.is_active;
        }
      });
  }
  public ngAfterViewChecked(): void {
    this.changeDetection.detectChanges();    
  } 
  // account approve & reject //
  public onApproveRejectVariableHolder(actionType: any) {
    this.cutomerTierForm.markAllAsTouched()
    if(!this.cutomerTierForm.get('customer_tier_id').value){
      return;
    }
    if (actionType === "approve") {
      this.actionTypes = "approved";
      this.onConfirmApproveAndRejectAccount();
    } else if (actionType === "reject") {
      this.actionTypes = "rejected";
      this.onConfirmApproveAndRejectAccount();
    }
  }
  public onConfirmApproveAndRejectAccount() {
    let data: any = {};
    if (this.actionTypes === "approved") {
      data.message = "Are you sure want to Approve Account?";
      data.actionType = 'Approve';
    } else if (this.actionTypes === "rejected") {
      data.message = "Are you sure want to Reject Account?";
      data.actionType = 'Reject';
    }
    this.dialogService
      .open(ConfirmModalComponent, {
        context: {
          data: data,
        },
      })
      .onClose.subscribe((value: any) => {
        if (value) {
          this.confirmValue = value;
          this.onActiveDeactiveAndApproveRejectAccountd();
        } else {
          this.isActiveDeactive = this.accountDetials.is_approved;
        }
      });
  }
  public onActiveDeactiveAndApproveRejectAccountd(): void {
    let payloadObj: any = {};
    payloadObj.user_id = parseInt(this.userId);
    payloadObj.action = this.actionTypes;
    payloadObj.rejected_reson = this.confirmValue;
    if(this.accountType === 'pending'){
        payloadObj.customer_tier_id = this.cutomerTierForm.get('customer_tier_id').value;
    }
    if(this.confirmValue === 'true'){
      delete payloadObj.rejected_reson;
    }
    this.subscription.push(this.accountService.onSendActiveDeactiveUserData(payloadObj).subscribe(
      (res: any) => {
        this.toastrService.success(res.message, "Success");
        this.getAccountDataById();
      },
      (error) => {
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    ));
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

  public resetAccountPassword(){
    this.isLoading = true;
    this.resetPaswordForm.markAllAsTouched()
    if(this.resetPaswordForm.invalid){
        this.isLoading = false;
      return;
    }
    let payloadObj:any = {};
    payloadObj.user_id = this.accountDetials.user_id
    payloadObj.new_password = this.utilService.convertStringBase64(this.resetPaswordForm.get('new_password').value);
    this.subscription.push(this.accountService.accountResetPassword(payloadObj).subscribe((res:any)=>{
      this.toastrService.success(res.message, "Success");
      this.isLoading = false;
      this.resetPaswordForm.reset();
    },(error) => {
       this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], "Error");
         }
          this.toastrService.danger(error.error.message, "Error");
    }));
  }
  public submitWalletData() {
    this.isLoading = true;
    this.customerWalletFrom.markAllAsTouched();
    if (this.customerWalletFrom.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj:any = {};
    payloadObj = this.customerWalletFrom.value;
    payloadObj.customer_id = this.accountDetials.customer_id
    payloadObj.transection_type = 'inward'
    this.subscription.push(
      this.customerService.saveWalletData(payloadObj).subscribe((res: any) => {
          this.isLoading = false;
          this.getCustomerBalanceData()
          this.customerWalletFrom.reset()
          this.toastrService.success(res.message, "Success");
          this.getWalletLadgerData('inward')
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
public setActivateTab(){
  this.setActiveSubAccount = true;
  this.setActiveAccountDetails = false;
  this.setWalletSubAccount = false;
  }
  public addSubAccount():void {
    let approved_user_id = this.utilService.getLocalStorageValue('approved_user_id')
    this.router.navigate([`pages/admin-area/accounts/add-edit-sub-account`], { queryParams: {parent_id : btoa(approved_user_id)}});
  } 
 public onEditUpdateAccount(){
  this.router.navigate(["pages/admin-area/accounts/edit-update-account"],{ queryParams: {user_id : btoa(this.userId)}});
 }
  public back() {
    if (this.accountType == "approved") {
      this.router.navigate(["pages/admin-area/accounts/approved-account"]);
    } else if (this.accountType == "pending" || this.accountType == "rejected") {
      this.router.navigate(["pages/admin-area/accounts/pending-account"]);
    }
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}  
}
