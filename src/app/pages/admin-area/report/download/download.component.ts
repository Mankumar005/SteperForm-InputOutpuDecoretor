import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UtilService } from '../../../../shared/common- services/util.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDateService, NbDatepickerComponent, NbToastrService } from '@nebular/theme';
import { ReportService } from '../../../../shared/component-services/admin-area.services.ts/report.service';
import * as moment from 'moment';
import { ExcelService } from '../../../../shared/common- services/excel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit, OnDestroy{
  @ViewChild(NbDatepickerComponent) datepicker : any;

  public subscription: Subscription[] = [];

  public shipmentReportList: Array <any> = []
  public shipmentExcelReport:any= [];

  public isLoading:boolean = false;
  public date = new Date();
  public startDateMin: Date;
  public max: Date;
  public endDateMin: Date;
 
  public hsnCount:number = 0;

  constructor(    
    public reportService: ReportService,
    public utilService: UtilService,
    private excelService: ExcelService,
    public fb: FormBuilder,
    public router: Router,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>
    ) { }

  public formValidations: any = {
    start_date: [{ type: 'required', message: 'Date is required' }],
    // end_date: [{ type: 'required', message: 'EndDate is required' }]
  };

  reportForm = this.fb.group({
    start_date: new FormControl(),
    end_date: new FormControl('')
  })

  ngOnInit(): void {
    this.reportForm.get("start_date").setValue(new Date());
    this.endDateMin = this.dateService.addDay(new Date(this.reportForm.get("start_date").value), 0);
    this.reportForm.get("start_date").valueChanges.subscribe((val: any) => {
      this.endDateMin = this.dateService.addDay(new Date(this.reportForm.get("start_date").value), 0);
    })
  }

  public showDatepicker() {
    this.datepicker.show();
  }

  public generateExcelReport() {
  this.reportForm.markAllAsTouched()
  if(this.reportForm.invalid){
    return;
  }
  this.isLoading = true;
  let payloadObj: any = {};
  payloadObj.start_date = moment.utc(this.reportForm.get('start_date').value).local().format("YYYY-MM-DD");
  payloadObj.end_date = moment.utc(this.reportForm.get('end_date').value).local().format("YYYY-MM-DD");
  if(payloadObj.end_date == 'Invalid date'){
    payloadObj.end_date = '';
  }
  console.log(payloadObj);
  this.subscription.push(this.reportService.getReportByDate(payloadObj.start_date,payloadObj.end_date).subscribe((res:any)=>{
    this.shipmentReportList = res.data;
    // console.log(res.data,'================getReportByDate========');
    if(res.data){
      this.shipmentReportList.forEach((element:any,i:any)=>{
        let obj: any = {};
        obj.Waybill_Type =  'House',
        obj.AWB_Prefix = '108',
        obj.AWB_Number ='',
        obj.HAWB_Number = element?.booking_no,
        obj.Airport_Of_Origin ='Delhi',
        obj.Shipper_Name = element?.shipment_booking_sender?.contact_name,
        obj.Shipper_Street_Address = element?.shipment_booking_sender?.address1,
        obj.Shipper_Street_Address2 = element?.shipment_booking_sender?.address2,
        obj.Shipper_City = element?.shipment_booking_sender?.city,
        obj.Shipper_Country = element?.shipment_booking_sender?.country_iso_code,
        obj.Consignee_Name = element?.shipment_booking_sender?.contact_name,

        obj.Consignee_Street_Address = element?.shipment_booking_recipient?.address2,
        obj.Consignee_Street_Address2 = element?.shipment_booking_recipient?.address2,
        obj.Consignee_City = element?.shipment_booking_recipient?.city,
        obj.Consignee_State_or_Province = element?.shipment_booking_recipient?.state?.state_iso_code,
        obj.Consignee_Postal_Code = element?.shipment_booking_recipient?.zip_code,
        obj.Consignee_Country = element?.shipment_booking_recipient?.country_iso_code,

        obj.Cargo_Piece_Count = element?.shipment_booking_package?.number_of_packages,
        obj.Cargo_Weight = element?.shipment_booking_package?.weight_per_package,
        obj.Cargo_Weight_UOM = element?.shipment_booking_package?.weight_unit,

        obj.Cargo_Description = element?.shipment_booking_commodity[0]?.harmonized_system_code?.description,

        obj.Marks_and_Numbers = '',
        obj.FDA_Indicator = 'N',
        obj.Include_Type_86 = 'Y',
        obj.Entry_Type = '86',
        obj.T86_Date_of_Arrival = '',
        obj.Mode_of_Transport = '40',
        obj.Bond_Type = '0',
        obj.Port_of_Entry = '2720',
        element.shipment_booking_commodity.forEach((elements:any,index:any)=>{
          obj[`HSN_Number_${index+1}`] = elements?.harmonized_system_code?.harmonized_system_code;
          obj[`Description_${index+1}`] = elements?.harmonized_system_code?.description,
          obj[`Line_Item_Value_${index+1}`] = elements?.harmonized_system_code?.harmonized_system_code?.weight,
          obj[`Country_of_Origin_${index+1}`] = elements?.harmonized_system_code?.harmonized_system_code?.manufacture_country_iso_code
          obj[`Product_ID`] = elements?.harmonized_system_code?.sku
        })
         this.shipmentExcelReport.push(obj);
         if(this.hsnCount < element.shipment_booking_commodity.length){
            this.hsnCount += 1
            this.utilService.setShipmentReportHeader.push(
              `HSN_Number_${this.hsnCount}`,
              `Description_${this.hsnCount}`,
              `Line_Item_Value_${this.hsnCount}`,
              `Country_of_Origin_${this.hsnCount}`,
              `Product_ID`,
            )
        }
   })
      // console.log('================shipmentExcelReport========', this.shipmentExcelReport);
    const shipmentExcelReportValue = this.shipmentExcelReport.map((value:any) => Object.values(value));
    this.excelService.generateExcel(this.utilService.setShipmentReportHeader,shipmentExcelReportValue);
    this.isLoading = false;
    }
  },error => {
    this.isLoading = false;
    if(error && error.error.errors && error.error.errors.failed) {
      this.toastrService.danger(error.error.errors.failed[0],'Error');
    }
  }))
 }
public ngOnDestroy() {
  this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}  

}
