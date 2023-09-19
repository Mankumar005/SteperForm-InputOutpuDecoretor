import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {
  @Input() data: any;
  public actionType: any = null;
  public message: string = "Are you sure?"
  public confirmButtonText: string = "Yes"
  public cancelButtonText: string = "No  "

  public formValidations: any = {
    reason: [{ type: "required", message: "Reason is required" }],
  };
  reasonFrom = this.fb.group({
    reason: new FormControl(""),
  });

  constructor(
    protected ref: NbDialogRef<ConfirmModalComponent>,
    public fb: FormBuilder,
  ) {
    //  this.dialogRef.updateSize('500px','156px')
  }

  ngOnInit(): void {
    if (this.data) {
      this.message = this.data.message || this.data;
      this.actionType = this.data.actionType
      if (this.data.buttonText) {
        this.confirmButtonText = this.data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = this.data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  public onConfirmClick(): void {
    this.reasonFrom.markAllAsTouched()
    if(this.reasonFrom.invalid){
      return;
    }
    if(this.actionType){
      if(this.actionType == 'Approve'){
        this.ref.close('true');
      }else if(this.actionType == 'Reject'){
        this.ref.close(this.reasonFrom.get('reason').value);
      }
    }else{
      this.ref.close(true);
    }
   
  }
  public cancel() {
    this.ref.close();
  }

}
