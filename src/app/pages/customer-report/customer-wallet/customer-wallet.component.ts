import { Component, ElementRef, EventEmitter, Input, KeyValueDiffers, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDateService, NbDatepickerComponent, NbToastrService } from '@nebular/theme';

import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { CustomerWalletTransactionService } from '../../../shared/component-services/customer-wallet.service';
import { UtilService } from '../../../shared/common- services/util.service';

@Component({
  selector: 'ngx-customer-wallet',
  templateUrl: './customer-wallet.component.html',
  styleUrls: ['./customer-wallet.component.scss']
})

export class CustomerWalletComponent implements OnInit, OnDestroy {
  @ViewChild(NbDatepickerComponent) datepicker: any;
  public searchControl!: FormControl;
  public subscription: Subscription[] = [];
  
  public customerList: Array<any> = []
  public customerHistoryList: Array<any> = []
  public shipmentExcelReport: any = [];
  public customerTransactionExcelReport: any = [];

  public isLoading: boolean = false;
  public isGenerateExcelReport: boolean = false;

  public date = new Date();
  public startDateMin: Date;
  public endDateMin: Date;

  public userDetails: any = null;
  public userId: any = null;

  public hsnCount: number = 0;

  public onPermission: any = {
    access: false,
    create: false,
    update: false,
    view: false,
    delete: false,
  }

  public source: LocalDataSource = new LocalDataSource();
  public pageSize = 10;
  public currentPage = 1;
  public showPerPage = 10;
  public totalCount: any;

  settings = {
    actions: false,
    mode: 'external',
    pager: {
      display: true,
      perPage: this.showPerPage,
    },
    columns: {
      index: {
        title: 'No',
        type: 'string',
        filter: false,
        sort: false,
        valuePrepareFunction: (val, row, cell) => {
          const pager = this.source.getPaging();
          const ret = (pager.page - 1) * pager.perPage + cell.row.index + 1;
          return ret;
        }
      },
      created_at: {
        title: 'Date',
        type: 'string',
      },
      wallet_mode: {
        title: 'Payment Mode',
        type: 'string',
        filter: false,
        sort: false,
      },
      description: {
        title: 'Description',
        type: 'string',
        filter: false,
        sort: false,
      },
      debit_amount: {
        title: 'Debit',
        type: 'string',
        filter: false,
        sort: false,
      },
      credit_amount: {
        title: 'Credit',
        type: 'string',
        filter: false,
        sort: false,
      },
    }
  };
  subject = new Subject<any>();

  constructor(
    public wallateService: CustomerWalletTransactionService,
    public utilService: UtilService,
    public fb: FormBuilder,
    public router: Router,
    private toastrService: NbToastrService,
    protected dateService: NbDateService<Date>
  ) {
      this.userDetails = this.utilService.getLocalStorageValue('userDetail')
    }

  bindingValue: any
  public formValidations: any = {
    start_date: [{ type: 'required', message: 'Date is required' }],
    user_id: [{ type: 'required', message: 'Customer is required' }],
    end_date: [{ type: 'required', message: 'Date is required' }]
  };
  customerForm = this.fb.group({
    user_id: new FormControl(),
    customer_name: new FormControl(),
    start_date: new FormControl(),
    end_date: new FormControl()
  })

  ngOnInit(): void {
    let date = new Date();
    let currDate = new Date();
    date.setMonth(date.getMonth() - 1);
    this.customerForm.get("start_date").setValue(new Date(date));
    this.customerForm.get("end_date").setValue(currDate);
    this.endDateMin = this.dateService.addDay(new Date(), 0);
    this.getCustomerList()
  }

  public getCustomerList() {
    this.subscription.push(
      this.wallateService.getCustomerData('').subscribe(
        (res: any) => {
          this.customerList = res.data;
          this.customerList.forEach((element: any) => {
            element.full_name = element.first_name + ' ' + element.last_name
          })
        },
        (error) => {
          if (error && error.error.errors && error.error.errors) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }
  public findCustomerTransaction() {
    this.customerForm.markAllAsTouched();
    if (this.customerForm.invalid) {
      return;
    }
    this.customerTransactionExcelReport = [];
    let payloadObj: any = {};
    payloadObj.user_id = this.userDetails.user_id
    payloadObj.start_date = moment.utc(this.customerForm.get('start_date').value).local().format("YYYY-MM-DD");
    payloadObj.end_date = moment.utc(this.customerForm.get('end_date').value).local().format("YYYY-MM-DD");
    if (payloadObj.start_date == 'Invalid date') {
      payloadObj.start_date = '';
    }
    this.subscription.push(
      this.wallateService.findCustomerWalletTransactionHistory(payloadObj).subscribe(
        (res: any) => {
          this.customerHistoryList = res.data;

          this.customerHistoryList.forEach((element: any) => {
            if (element.shipment_transaction) {
              element.wallet_mode = element.shipment_transaction.payment_mode
            } else {
              element.wallet_mode = element.wallet_payment_mode_name
            }
            element.created_at = moment.utc(element?.created_at).local().format("DD-MM-YYYY hh:mm A");
            if (element.transaction_type === 'inward') {
              element.credit_amount = element.amount
            } else if (element.transaction_type === 'outward') {
              element.description = element.shipment_booking.booking_no
              element.debit_amount = element.amount
            }
          })
          // console.log(this.customerHistoryList,'customerHistoryList======');
          if (this.customerHistoryList.length) {
            this.toastrService.success(res.message, "Success");
            this.source.load(this.customerHistoryList)
          } else if (!this.customerHistoryList.length) {
            this.source.load([])
            this.toastrService.danger('Customer transaction History not found', "Error");
          }
        },
        (error) => {
          if (error && error.error.errors && error.error.errors) {
            this.toastrService.danger(error.error.errors.failed[0], "Error");
          }
        }
      )
    );
  }

  public getCustomerWalletTrasactionList() {
  }
  public showDatepicker() {
    this.datepicker.show();
  }
  public generateExcelReport() {
    if (this.customerHistoryList.length) {
      this.isGenerateExcelReport = true;
      this.customerHistoryList.forEach((element: any) => {
          let obj: any = {};
          obj.Date = element.created_at,
          obj.Payment_Mode = element.wallet_mode,
          obj.Description = element.description,
          obj.Debit = element.debit_amount,
          obj.Credit = element.credit_amount,
          this.customerTransactionExcelReport.push(obj);
      })
      // setTimeout(() => {
      // // console.log('================customerTransactionExcelReport========', this.customerTransactionExcelReport);
      // const customerTransactionExcelReportValue = this.customerTransactionExcelReport.map((value: any) => Object.values(value));
      // this.excelService.generateCustomerTransactionExcel(this.utilService.setCustomerWalletTransactionHeader, customerTransactionExcelReportValue);
      // this.isGenerateExcelReport = false;
      // },500);
    }
  }
  public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
  }

}