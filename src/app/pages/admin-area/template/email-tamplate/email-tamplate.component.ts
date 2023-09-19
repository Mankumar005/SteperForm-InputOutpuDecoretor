import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../../shared/common- services/util.service';
import { HelpDeskService } from '../../../../shared/component-services/help-desk.service';
import { NbToastrService } from '@nebular/theme';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'ngx-email-tamplate',
  templateUrl: './email-tamplate.component.html',
  styleUrls: ['./email-tamplate.component.scss']
})
export class EmailTamplateComponent implements OnInit, OnDestroy{
  public subscription: Subscription[] = [];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };


  public isLoading: boolean = false;
  public isTextEditior: boolean = false;

  public htmlContent = '';
  public tagValue: any =  null;

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public helpDeskService: HelpDeskService,
    private toastrService: NbToastrService
  ) {}

  public formValidations: any = {
    template_name: [{ type: "required", message: "Template Name is required" }],
    subject: [{ type: "required", message: "Subject is required" }],
    template_content: [{ type: "required", message: "Template Content is required" }],
  };

  emailTemplateFrom: FormGroup = this.fb.group({
    template_name: new FormControl(""),
    subject: new FormControl(""),
    template_content: new FormControl(""),
  });

 
ngOnInit(): void {
  this.htmlContent = '<p> okkkkk </p>'
}
 
  public onSubmit() {
    this.isLoading = true;
    this.emailTemplateFrom.markAllAsTouched();
    if (this.emailTemplateFrom.invalid) {
      this.isLoading = false;
      return;
    }
    let payloadObj: any = {};
    payloadObj = this.emailTemplateFrom.value
    console.log(payloadObj, "payloadObj====");
    return;
    this.subscription.push(this.helpDeskService.onSaveContactUsData(payloadObj).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toastrService.success(res.message, "Success");
        this.emailTemplateFrom.reset()
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
