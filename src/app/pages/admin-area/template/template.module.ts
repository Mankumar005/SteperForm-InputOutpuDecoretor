import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { TemplateComponent } from './template.component';
import { SharedModule } from '../../../shared/sharde.module';
 
import { EmailTamplateComponent } from './email-tamplate/email-tamplate.component';


@NgModule({
  declarations: [
    TemplateComponent,
    EmailTamplateComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    SharedModule
  ]
})
export class TemplateModule { }
