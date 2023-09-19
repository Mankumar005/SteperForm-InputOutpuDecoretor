import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FAQService } from '../../../../shared/component-services/admin-area.services.ts/faq.service';
import { UtilService } from '../../../../shared/common- services/util.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-add-edit-faq',
  templateUrl: './add-edit-faq.component.html',
  styleUrls: ['./add-edit-faq.component.scss']
})
export class AddEditFaqComponent implements OnInit,OnDestroy,AfterViewChecked{
  public subscription: Subscription[] = [];
  
  public faqForm : FormGroup;
  public formArray: FormArray;

  public faqId:any = null;

  public isLoading:boolean = false;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    public faqService: FAQService,
    public utilService: UtilService,
    public fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private toastrService: NbToastrService,
  ) {
    this.route.queryParams.subscribe((params: any) => { 
      if(params.add_faq == 0){
        return;
      }else if(params.faq_id){
        this.faqId = atob(params.faq_id);
        this.getFaqDetails(this.faqId)
      }
      // else {
      //   this.router.navigate(["pages/admin-area/faq/faq-list"]);
      // }
    });
  }

public formValidations: any = {
  question: [{ type: 'required', message: 'Question is required' }],
  answer: [{ type: 'required', message: 'Answer is required' }]
  };

  ngOnInit(): void {
    this.faqForm = this.fb.group({
      question: new FormControl(''),
      answer: new FormControl(''),
      formArray: this.fb.array([this.createItem()])
    })
  }

public createItem() {
    return this.fb.group({
      question: [''],
      answer: ['']
    })
  }

public addItem() {
    this.formArray = this.faqForm.get('formArray') as unknown as FormArray;
    this.formArray.push(this.createItem());
  }

public removeFaq(index: any) {
    (this.faqForm.get('formArray') as FormArray).removeAt(index);
  }
public getControls() {
    return (this.faqForm.get('formArray') as FormArray).controls;
  }

public getFaqDetails(id:any){
  this.subscription.push(this.faqService.getFaqDetailsBydId(id).subscribe((res:any)=>{
    if(res){
      this.faqForm.patchValue(res.data)
    }
  },(error) => {
    this.isLoading = false;
    this.router.navigate(["pages/admin-area/faq/faq-list"]);
    if (error && error.error.errors && error.error.errors.failed) {
      this.toastrService.danger(error.error.errors.failed[0], "Error");
    }
    // this.toastrService.danger(error.error.message, "Error");
  }));
  
}
public onSubmit() {
    this.isLoading = true;
    this.faqForm.markAllAsTouched()
    if(this.faqForm.invalid){
        this.isLoading = false;
      return;
    }
    let payloadObj:any = {};
        payloadObj =  this.faqForm.value;
    if(this.faqId){
      payloadObj.faq_id = this.faqId;
      payloadObj.question = payloadObj.question;
      payloadObj.answer = payloadObj.answer;
      delete payloadObj.formArray;
    }else {
      payloadObj.faq_id = '';
      payloadObj.faq = payloadObj.formArray;
      delete payloadObj.question;
      delete payloadObj.answer;
      delete payloadObj.formArray;
    }
    this.subscription.push(this.faqService.addUpdateFAQData(payloadObj).subscribe((res:any)=>{
      this.toastrService.success(res.message, "Success");
      this.isLoading = false;
      this.faqForm.reset();
      this.router.navigate(["pages/admin-area/faq/faq-list"]);
    },(error) => {
      this.isLoading = false;
      if (error && error.error.errors && error.error.errors.failed) {
        this.toastrService.danger(error.error.errors.failed[0], "Error");
      }
      this.toastrService.danger(error.error.message, "Error");
    }));
    
  }


public back() {
    this.router.navigate(["pages/admin-area/faq/faq-list"]);
  }

public ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
}

public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}  
}
