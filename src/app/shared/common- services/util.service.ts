import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ENTER, TAB } from '@angular/cdk/keycodes';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

    public editProfileEmmiter: EventEmitter<any> = new EventEmitter();
    public notiCountEmmiter: EventEmitter<any> = new EventEmitter();
    public menuChangeEmitter: EventEmitter<any> = new EventEmitter();
    public pageBreadcrumOrTitle: EventEmitter<any> = new EventEmitter();
    public pageBreadcrumOrTitlePush: EventEmitter<any> = new EventEmitter();
    public sideNavState$: Subject<boolean> = new Subject();
    public progessBarCallback: EventEmitter<any> = new EventEmitter();
    public deleteEmmiter: EventEmitter<boolean> = new EventEmitter(false);

    public isLoginEmmiter: EventEmitter<any> = new EventEmitter();
    public realodPage  = new BehaviorSubject<boolean>(false)
    private _dateFormat: string = 'DD-MMM-YYYY';
    private _dateTimeFormat: string = 'DD/MM/YYYY hh:mm A';
    private _separatorKeysCodes = [ENTER, TAB];
    public tokenDetails: any = null;
    public userPermissions: any;
    public isCardView: boolean = true;
    public  regexp_whiteSpace = /^\S*$/;
    private _linkUrlRegex: RegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/; // `(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?`;;
    public _emialRegExp: RegExp = /^([A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9]))$/;
    private user_regex: RegExp = /(^[-!#$%&\'*+/=?^`{}|~\w]+(\.[-!#$%&\'*+/=?^`{}|~\w]+)*$|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*"$)/i;
    private domain_regex: RegExp = /(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}|[A-Z0-9-]{2,})$|^\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i;

    public redirectTo:string='';

    public finalTotalPercentage: any
    public store_input_value = new Subject<any>();
 


  constructor(
    private location: Location,
    public router: Router,
    ) { }

    public experienceMonthArray :Array<any> = [
        {month: '0 month', value: 0},    
        {month: '1 month', value: 1},    
        {month: '2 months', value: 2},
        {month: '3 months', value: 3},   
        {month: '4 months', value: 4},      
        {month: '5 months', value: 5},    
        {month: '6 months', value: 6},   
        {month: '7 months', value: 7},    
        {month: '8 months', value: 8},      
        {month: '9 months', value: 9},
        {month: '10 months', value: 10},
        {month: '11 months', value: 11},
    ];
    public experienceYearArray :Array<any> = [
        {year: '0 year', value: 0},    
        {year: '1 year', value: 1},    
        {year: '2 years', value: 2},
        {year: '3 years', value: 3},   
        {year: '4 years', value: 4},      
        {year: '5 years', value: 5},    
        {year: '6 years', value: 6},   
        {year: '7 years', value: 7},    
        {year: '8 years', value: 8},      
        {year: '9 years', value: 9},
        {year: '10 years', value: 10},
        {year: '11 years', value: 11},
        {year: '12 years', value: 12},
    ];
 
    public setShipmentReportHeader = [
        'Waybill Type',
        'AWB Prefix',
        'AWB Number',
        'HAWB Number',
        'Airport Of Origin',
        'Shipper Name',
        'Shipper Street Address',
        'Shipper Street Address',
        'Shipper City',
        'Shipper Country',
        'Consignee Name',
        'Consignee Street Address',
        'Consignee Street Address',
        'Consignee City',
        'Consignee State or Province',
        'Consignee Postal Code',
        'Consignee Country',
        'Cargo Piece Count',
        'Cargo Weight',
        'Cargo Weight UOM',
        'Cargo Description',
        'Marks and Numbers',
        'FDA Indicator',
        'Include Type 86',
        'Entry Type',
        'T86 Date of Arrival',
        'Mode of Transport',
        'Bond Type',
        'Port of Entry',
    ]

    public setCustomerWalletTransactionHeader = [
        'Date',
        'Payment Mode',
        'Description',
        'Debit',
        'Credit',
    ]    
public getEmailTemplateTag:Array<any> = [
    {tag_name :  '[CUSTOMER_COMPANY_NAME]'},
    {tag_name :  '[CUSTOMER_NAME]'},
    {tag_name :  '[CUSTOMER_PHONE]'},
    {tag_name :  '[CONTACT_MESSAGE]'},
]

    sendUpdate(message: any) { //the component that wants to update something, calls this fn
        this.store_input_value.next(message ); //next() will feed the value in Subject
    }

    getUpdate(): Observable<any> { //the receiver component calls this function 
        return this.store_input_value.asObservable(); //it returns as an observable to which the receiver funtion will subscribe
    }


public genrateFormData(form: any) {
        const fd: FormData = new FormData();
        Object.keys(form).map((key: string) => {
          let value: any = form[key];
          if (Array.isArray(value)) {
            value.map((val) => {
              fd.append(key, val);
            });
            if (!value.length) {
              fd.append(key, '[]');
            }
          } else {
            if (value != null) {
              fd.append(key, value);
            } else if(value == undefined){
              fd.append(key, '');
            }else {
              fd.append(key, '');
            }
          }
        });
        return fd;
} 

    /* toastr msg */
    // showSuccess(message : string,action : string) {
//         showSuccess(message : string,action : string = "Success") {
//         this._toastr.success(message,action,{
//             timeOut: 3000,
//           });
//       }
//       showError(message : string,action : string = "Error") {
//         this._toastr.error(message,action,{
//             timeOut: 3000,
//           });
//       }
//       showInfo(message : string,action : string) {
//         this._toastr.info(message,action,{
//             timeOut: 3000,
//           });
//       }
//       showWarnnig(message : string,action : string) {
//         this._toastr.warning(message,action,{
//             timeOut: 3000,
//           });
//       }
//   public showToastMessage(message: string, action: string = 'Oops', duration: number = 3000) {
//     this._snackBar.open(message, action, {
//         duration: duration,
//     });
// }
// public showErrorCall(err:any, showToast: boolean, msg: string = 'Something went wrong', title: string = 'Oops') {
//   if (err.error && err.error.code == 11000) {
//       let errorMsg = '';
//       Object.keys(err.error.keyValue).map((key: string) => {
//           errorMsg += err.error.keyValue[key] + ` ${key} already exist`;
//       })
//       if (showToast) {
//           this.showToastMessage(errorMsg ? errorMsg : msg);
//           return;
//       }
//   } else if (err && err.error == 'Invalid token') {
//       localStorage.clear();
//       this.router.navigate(['/main']);
//       return;
//   } else {
//       if (showToast) {
//           if (err.error && (typeof (err.error) === 'string')) {
//               this.showToastMessage(err.error);
//           } else {
//               this.showToastMessage(msg);
//           }
//           return;
//       }
//   }
// }

//trim form value //

public trimFormValue(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => formGroup.get(key).setValue(formGroup.get(key).value.trim()));
}


// white space Error //
public noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
public trimValidator(control: FormControl){
    if (control.value.startsWith(' ')) {
      return {
        'trimError': { value: 'White space not allowed' }
      };
    }
    if (control.value.endsWith(' ')) {
      return {
        'trimError': { value: 'White space not allowed' }
      };
    }
  
    return null;
  };
 
public getNoOfCellsToShow() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

    if (isMobile) {
        return 1;
    } else if (isTablet) {
        return 2
    } else {
        return 3
    }
}

get separatorKeysCodes(): Array<number> {
    return this._separatorKeysCodes;
}

get dateTimeFormat(): string {
    return this._dateTimeFormat;
}

get linkUrlRegex(): RegExp {
    return this._linkUrlRegex;
}

public goBack() {
    this.location.back();
}

 

public parsePermissions() {
    // let permissions = JSON.parse(localStorage.getItem('permissions'));
    // return this.userPermissions = permissions;
    /* if (this.userPermissions) {
        return this.userPermissions;
    } else {
        let permissions = JSON.parse(localStorage.getItem('permissions'));
        return this.userPermissions = permissions;
    } */
}

get getPermissions(): any {
    return this.parsePermissions();
}

public getUserPermissions(menuCode: string, permissionCode: string) {
    if (menuCode && permissionCode) {
        if (this.getPermissions && this.getPermissions[menuCode] && this.getPermissions[menuCode].includes(permissionCode)) {
            return true;
        } else {
            return false;
        }
    }
    return true;
}

public setCardView(isCardView: boolean) {
    return this.isCardView = isCardView;
}

get getIsCardView(): any {
    return this.isCardView;
}

public getIsMobileBrowser() {
    // var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    var isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
    if (isMobile) {
        this.setCardView(true);
    }
    return isMobile;
}

public logOut() {
    // this.router.navigate(['/home']);
    this.tokenDetails = null;
    localStorage.clear();
    this.router.navigate([''])
    /* setTimeout(() => {
    }, 1000); */
}


// public exportToExcelData(rows: any, columns: any, tblNm: any, companies?: any, ingnorColl?: any) {
//     /* We have 1 extra col for Institution Name and others are for 5 + 1 co's. Max Col: 1 + (6 * 4) = 25  */
//     const colsToBeUsed = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
//         'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS',
//         'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];
//     const finalArr = [
//         // companies - Main Header
//         [],
//     ];

//     const merges = [];
//     columns.map((col, index) => {
//         // map inside map - because we want sub header name replicated for each company
//         if (!col.hidden) {
//             finalArr[0].push(col.title);
//         }
//     });

//     (<any[]>JSON.parse(JSON.stringify(rows))).forEach((x, ind) => {
//         // var obj: any = new Object();
//         var frmt = new Format();
//         var arr = [];
//         arr.push(ind + 1);
//         for (var i = 0; i < columns.length; i++) {
//             if (!columns[i].hidden) {
//                 if (columns[i].type === 'dateTime') {
//                     let transfrmVal = x[columns[i].key] ? moment(x[columns[i].key]).format('DD/MM/YYYY hh:mm A') : '';
//                     // obj[columns[i].title] = transfrmVal;
//                     arr.push(transfrmVal)

//                 } else if (columns[i].type === 'date') {
//                     let transfrmVal = x[columns[i].key] ? moment(x[columns[i].key]).format('DD/MM/YYYY') : '';
//                     // obj[columns[i].title] = transfrmVal;
//                     arr.push(transfrmVal)
//                 } else {
//                     if (columns[i].title !== 'Sr') {
//                         let transfrmVal = x[columns[i].key] ? frmt.transform(x[columns[i].key], columns[i].key) : '';
//                         arr.push(transfrmVal)
//                         // obj[columns[i].title] = transfrmVal;
//                     }
//                 }
//             }
//         }
//         finalArr.push(arr);
//     });
//     this.downloadExcel(finalArr, tblNm, merges);
// }

// public downloadExcel(json: any[], excelFileName: string, merges?: any): void {
//     let worksheet: XLSX.WorkSheet;
//     if (merges) {
//         worksheet = XLSX.utils.aoa_to_sheet(json);
//         worksheet['!merges'] = merges;
//     } else {
//         worksheet = XLSX.utils.json_to_sheet(json);
//     }

//     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

//     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     this.saveAsExcelFile(excelBuffer, excelFileName);
// }

// private saveAsExcelFile(buffer: any, fileName: string): void {
//     const data: Blob = new Blob([buffer], {
//         type: 'application/octet-stream'
//     });
//     FileSaver.saveAs(data, fileName + "_" + new Date().toLocaleDateString() + "_" + new Date().toLocaleTimeString() + EXCEL_EXTENSION);
// }

public getLocalStorage(key: string) {
    return localStorage.getItem(key);
}

public setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, value);
}

public stateSelected(state: any) {
    if (state) {
        localStorage.setItem('STATE_NAME', state);
    }
    let url: string = this.router.url.split('?')[0];
    this.location.replaceState(url);
    setTimeout(() => {
        window.location.reload();
    }, 0);
}

public editProfileChange() {
    this.editProfileEmmiter.emit(true);
}

public newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

public validateEmail(email: string) {
    /* Same logic and regex used as in exchangeConnectApi1's Marshmallow library */
    if (!email) return false;

    const splitted_email = this.rsplit(email, "@", 1);
    const user_part = splitted_email[0], domain_part = splitted_email[1];

    if (this.user_regex.test(user_part) && this.domain_regex.test(domain_part)) {
        return true;
    }
    return false;
}

public rsplit(str:any, sep:any, maxsplit:any) {
    var split = str.split(sep);
    return maxsplit ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit)) : split;
}

public convertStringBase64(str: any) {
    return btoa(str);
}

public storeLocalStorageValue(key: string, value: any, isNeedToString: boolean = true): void {
    if (isNeedToString) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        localStorage.setItem(key, value);
    }
}

public getLocalStorageValue(key: string): any {
    if (localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key)|| '{}');
    } else {
        return ''
    }
}

public checkFileUploadType(file: any, isImageUpload: boolean = false, acceptTypes?: Array<string>) {
    /* check validation before file upload using file content.. */
    let type = file.type;
    let typeArray = [];
    if (!type) {
        let name = file.name;
        name = name.split('.');
        type = name[1];
    }

    if (acceptTypes) {
        typeArray = acceptTypes;
    } else if (isImageUpload) {
        typeArray = ['image/jpeg', 'jpeg', 'jpg', 'image/png', 'png', 'image/gif', 'image/svg+xml', 'image/bmp', 'bmp'];
    } else {
        typeArray = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/bmp',
            'application/msword', 'application/pdf', 'text/plain',
            'application/vnd.ms-excel', 'application/msword', 'doc', 'docx', 'csv', 'xlsx', 'xls',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    }

    if (typeArray.indexOf(type) > -1) {
        return true;
    } else {
        // this.showToastMessage("Upload your Resume as PDF or JPEG.");
        // this.showError('Upload your Resume as PDF or JPEG.','Error');
        return false;
    }
}

}
