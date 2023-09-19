import { NgModule } from '@angular/core';
import { ShipmentsRoutingModule } from './shipments-routing.module';
import { ShipmentsComponent } from './shipments.component';
import { BookShipmentsComponent } from './book-shipments/book-shipments.component';
import { SharedModule } from '../../shared/sharde.module';
import { ShipmentsHistoryComponent } from './shipments-history/shipments-history.component';
import { DialogNamePromptComponent } from './dialog-name-prompt/dialog-name-prompt.component';
import { ShowcaseDialogComponent } from './showcase-dialog/showcase-dialog.component';
import { ShipmentHistoryDetailsComponent } from './shipment-history-details/shipment-history-details.component';
import { StepOneComponent } from './stepper-component/step-one/step-one.component';
import { StepTwoComponent } from './stepper-component/step-two/step-two.component';
import { StepThreeComponent } from './stepper-component/step-three/step-three.component';
import { StepFourComponent } from './stepper-component/step-four/step-four.component';
import { StepFifthComponent } from './stepper-component/step-fifth/step-fifth.component';
import { StepSixComponent } from './stepper-component/step-six/step-six.component';

@NgModule({
  imports: [
    ShipmentsRoutingModule,
    SharedModule
  ],
  declarations: [
    ShipmentsComponent,
    BookShipmentsComponent,
    ShipmentsHistoryComponent,
    DialogNamePromptComponent,
    ShowcaseDialogComponent,
    ShipmentHistoryDetailsComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    StepFourComponent,
    StepFifthComponent,
    StepSixComponent
  ],
  providers: [
  ],
})
export class ShipmentsModule { }
