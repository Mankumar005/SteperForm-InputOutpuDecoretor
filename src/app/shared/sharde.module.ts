import { NgModule } from '@angular/core';
import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarKitModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbChatModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbRadioModule,
  NbRouteTabsetModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbToggleModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbUserModule,
  NbWindowModule,
} from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesModule } from '../pages/pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CKEditorModule } from 'ng2-ckeditor';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputTrimModule } from 'ng2-trim-directive';
import { ConfirmModalComponent } from './modal-services/confirm-modal/confirm-modal.component';
import { ShipmentEditViewComponent } from './render-component/shipment-edit-view/shipment-edit-view.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxVerticalTimelineModule } from 'ngx-vertical-timeline';
import { NgOtpInputModule } from  'ng-otp-input';

const MODULES = [
    ThemeModule,
    PagesModule,
    NbInputModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    NbAlertModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    CKEditorModule,
    NbRadioModule,
    NbDatepickerModule,
    NbSelectModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbListModule,
    NbAccordionModule,
    InputTrimModule,
    NbCalendarModule,
    NbCalendarKitModule,
    NbCalendarRangeModule,
    NbChatModule,
    NbProgressBarModule,
    NbSpinnerModule,
    NbEvaIconsModule,
    NbToggleModule,
    NgSelectModule,
    NbTooltipModule,
    HttpClientModule,
    CKEditorModule,
    AngularEditorModule,
    NgxVerticalTimelineModule,
    NgOtpInputModule
];

const COMPONENTS = [
 
];

// const ENTRY_COMPONENTS = [
//   ShowcaseDialogComponent,
//   DialogNamePromptComponent,
//   WindowFormComponent,
//   NgxPopoverCardComponent,
//   NgxPopoverFormComponent,
//   NgxPopoverTabsComponent,
// ];

@NgModule({
  declarations: [
    // ...COMPONENTS,
    ConfirmModalComponent,
    ShipmentEditViewComponent,
  ],
  imports: [
    ...MODULES,
  ],
  exports : [
    ...MODULES,
  ]
})
export class SharedModule { }
