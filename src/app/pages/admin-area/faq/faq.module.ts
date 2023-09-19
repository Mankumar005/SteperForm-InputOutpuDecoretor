import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { SharedModule } from '../../../shared/sharde.module';
import { FaqListComponent } from './faq-list/faq-list.component';
import { AddEditFaqComponent } from './add-edit-faq/add-edit-faq.component';


@NgModule({
  declarations: [
    FaqComponent,
    FaqListComponent,
    AddEditFaqComponent
  ],
  imports: [
    CommonModule,
    FaqRoutingModule,
    SharedModule
  ]
})
export class FaqModule { }
