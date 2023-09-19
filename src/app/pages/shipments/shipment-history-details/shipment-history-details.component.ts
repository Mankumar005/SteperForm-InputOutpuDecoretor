import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../../shared/common- services/util.service';
import { ShipmentNowService } from '../../../shared/component-services/shipment-now.service';
import { NbToastrService } from '@nebular/theme';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'ngx-shipment-history-details',
  templateUrl: './shipment-history-details.component.html',
  styleUrls: ['./shipment-history-details.component.scss']
})
export class ShipmentHistoryDetailsComponent {
  shipmentTrackingForm: UntypedFormGroup;
  public book_id: any;
  public shipment_booking_id: any;
  public isLoading:boolean = false;
  public isSaveBtnLoading:boolean = false;
  public shipmentsDetailsData: any;
  public isPrintLabel: any;
  public selectedStatusId: any;
  public commodityTotalQty: any = 0;
  public commodityTotalWeight: any = 0;
  public commodityTotalCustomsValue: any = 0;
  public statusData: Array<any> = [];
  public subscription: Subscription[] = [];
  public trackingOrderStatusArray: Array<any> = [];
  public userRole: any; 
  public auth_token = ''

  public formValidations: any = {
    order_status_id: [{ type: 'required', message: ' Status is required' }],
    comment: [{ type: 'required', message: ' Comment is required' }]
  };

  constructor(
    public utilService: UtilService,
    public router: Router,
    public route: ActivatedRoute,
    public shipmentNowService: ShipmentNowService,
    private http: HttpClient,
    private toastrService: NbToastrService,
    private fb: UntypedFormBuilder,
    private jwtHelper: JwtHelperService
    
  ) { 
    this.route.queryParams.subscribe((params: any) => {
      this.book_id = atob(params.book_id);
      if (this.book_id) {
        this.getShipmentDetailsDataById()
      }
    });
    this.userRole = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
    this.createForm();
    this.getStatusApi();
  }

  public createForm() {
    this.shipmentTrackingForm = this.fb.group({ 
      tracking_order_id: [0],
      order_status_id: [null, Validators.required],
      comment: ['', Validators.required]
    })
  }

  getStatusApi() {
    this.isLoading = true;
      this.subscription.push(
        this.shipmentNowService.getStatusData().subscribe(
          (res: any) => { 
            console.log("res !!!", res);
            if(res && res.data) {
              this.statusData = res.data;
            }
          })
        )
    }

  getShipmentDetailsDataById() {
    this.isLoading = true;
    this.shipmentNowService.getShipmentBookingDetailsDetailsById(this.book_id).subscribe(
      (res: any) => {
        this.isPrintLabel = res.data.is_draft;
        this.shipment_booking_id = res.data.shipment_booking_id;
        if(res.data && res.data.is_draft !== 0) {
          this.router.navigateByUrl("pages/shipments/shipments-history");
        }
        if(res.data && res.data.shipment_billing_prefrence) {
          if(res.data.shipment_billing_prefrence.shipment_sender_notification && res.data.shipment_billing_prefrence.shipment_sender_notification.length) {
            res.data.shipment_billing_prefrence.sender_notification_types.forEach((element: any) => {
              element.isChecked = false;
              res.data.shipment_billing_prefrence.shipment_sender_notification.forEach((selectedSender: any) => {
                if(element.shipment_notification_type_id === selectedSender.shipment_notification_type_id) {
                  element.isChecked = true;
                }
              });
            });
          }
        }

        if(res.data && res.data.shipment_billing_prefrence) {
          if(res.data.shipment_billing_prefrence.shipment_recipient_notification && res.data.shipment_billing_prefrence.shipment_recipient_notification.length) {
            res.data.shipment_billing_prefrence.recipient_notification_types.forEach((element: any) => {
              element.isChecked = false;
              res.data.shipment_billing_prefrence.shipment_recipient_notification.forEach((selectedRecipient: any) => {
                if(element.shipment_notification_type_id === selectedRecipient.shipment_notification_type_id) {
                  element.isChecked = true;
                }
              });
            });
          }
        }
        
        this.shipmentsDetailsData = res.data;
        this.shipmentsDetailsData.shipment_booking_commodity.forEach((element: any) => {
          this.commodityTotalQty += parseFloat(element.quantity);
          this.commodityTotalWeight += parseFloat(element.weight)
          this.commodityTotalCustomsValue += parseFloat(element.declared_value);

        });
        this.shipmentsDetailsData.shipment_booking_package.shipment_date = moment.utc(this.shipmentsDetailsData.shipment_booking_package.shipment_date).local().format("MM-DD-yyyy");
   
        this.getShipmentTrackingDataById();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.router.navigateByUrl("pages/shipments/shipments-history");
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      }
    );
  }

  getShipmentTrackingDataById() {
    this.isLoading = true;
    this.shipmentNowService.getShipmentTrackingDetailsById(this.shipmentsDetailsData.booking_no).subscribe(
      (res: any) => {
        this.trackingOrderStatusArray = [];
        if(res && res.data) {
          this.isLoading = false;
          res.data.forEach((element: any) => {
            element.timeLIneDate = moment.utc(element?.created_at).local().format("dddd, Do MMMM");
          });
          this.trackingOrderStatusArray = res.data;
        }
      },(error) => {
        this.isLoading = false;
        this.trackingOrderStatusArray = [];
        // if (error && error.error.errors && error.error.errors.failed) {
        //   this.toastrService.danger(error.error.errors.failed[0], "Error");
        // }
      })
  }

  printLabelById(){
    this.isLoading = true;
    this.shipmentNowService.printLabelById(this.shipmentsDetailsData.shipment_booking_id).subscribe((res: any) => {
      if(res.data.url){
        // this.toastrService.success(res.message, "Success");
        setTimeout(() => {
        window.open(res.data.url, "_blank");
        },1000);
      }
      this.isLoading = false;
      },(error) => {
        this.isLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      })
  }

  // getAPICall(){
  //   const requestOptions: Object = {
  //     headers: new HttpHeaders().append('Authorization', 'Bearer sw7w2dpaxsZr5cah31LBGIaLV5iRkIHCSa1oECrhZqJA0Hi4Em2vB95xaDfjDxLt'),
  //     responseType: 'text'
  //   }
  //   this.http.get<string>(`https://lphapparelinc.myjazva.com/jz/api/v1/order/labels/6`, 
  //       requestOptions)
  //           .subscribe(response => {
  //                  console.log(response,'============response=============');
  //           }
  //   );
  //  }

  saveData() {
    this.shipmentTrackingForm.markAllAsTouched();
    this.shipmentTrackingForm.updateValueAndValidity();
    if(this.shipmentTrackingForm.invalid) {
      return;
    }
    this.isSaveBtnLoading = true;
    let payloadObj: any = this.shipmentTrackingForm.value;
    payloadObj.shipment_booking_id = this.shipment_booking_id ? this.shipment_booking_id : null;
    this.shipmentNowService.addUpdateTreacking(payloadObj).subscribe(
      (res: any) => {
        if(res) {
          this.isSaveBtnLoading = false;
          this.shipmentTrackingForm.reset();
          this.getShipmentTrackingDataById();
          this.toastrService.success("Tracking order save successfully.", "Success");
        }
      },(error) => {
        this.isSaveBtnLoading = false;
        if (error && error.error.errors && error.error.errors.failed) {
          this.toastrService.danger(error.error.errors.failed[0], "Error");
        }
      })
  }

  public printPdf(url: any) {
    if(url) {
      window.open(url, "_blank");
    }
  }

  public back(){
     this.router.navigate(['/pages/shipments/shipments-history'])
 }

}
