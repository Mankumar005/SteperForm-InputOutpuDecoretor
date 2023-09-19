import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../shared/common- services/util.service';
import { NbToastrService } from '@nebular/theme';
import { ChangePasswordService } from '../../shared/auth-services/auth-component-services/change-password';
import { PasswordStrengthValidator } from '../../shared/custom-validator/password.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit,OnDestroy {
  public subscription: Subscription[] = [];

  public allSubscibers: Array<any> = [];

  public changePassFrom!: FormGroup;

  public isLoading : boolean =  false;
  public currentPassword:boolean = false;
  public newPassword:boolean = false;
  public confirmPassword:boolean = false;

  public userDetials:any ;
 
  public formValidations: any = {
    current_password: [{ type: 'required', message: 'Current Password is required' }],
    new_password: [ { type: 'required', message: 'Password is required' }],
    confirm_password: [ { type: 'required', message: 'Confirm Password is required' }],
  };

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public authService: ChangePasswordService,
    private toastrService: NbToastrService,
  
  ) {}

  ngOnInit(): void {
    this.changePassFrom = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.minLength(8),PasswordStrengthValidator]],
      confirm_password: ['', [Validators.required]],
    },
    {
      validators: this.password.bind(this)
    });
    this.userDetials = this.utilService.getLocalStorageValue('userDetail')
  }

  onSubmit() {
    this.changePassFrom.get('current_password')?.setValue((this.changePassFrom.get('current_password')?.value
    ? this.changePassFrom.get('current_password')?.value: ' ').trim());
    this.changePassFrom.get('new_password')?.setValue((this.changePassFrom.get('new_password')?.value
    ? this.changePassFrom.get('new_password')?.value: ' ').trim());
    this.changePassFrom.updateValueAndValidity();
    this.changePassFrom.markAllAsTouched();
    
    if (this.changePassFrom.valid) {
      this.isLoading = true;
      let basicDetailForm:any = {}
      basicDetailForm = this.changePassFrom.value;
      basicDetailForm.user_id = this.userDetials.user_id
      delete basicDetailForm.confirm_password
 
      basicDetailForm.current_password = this.utilService.convertStringBase64(basicDetailForm.current_password);
      basicDetailForm.new_password = this.utilService.convertStringBase64(basicDetailForm.new_password);
      this.subscription.push(this.authService.changeUserPassword(basicDetailForm).subscribe((res: any) => {
          this.isLoading = false;
          this.utilService.storeLocalStorageValue('userDetail', res.data);
          // this.utilService.storeLocalStorageValue('access_token',res.access_token,false);
          this.toastrService.success(res.message,'Success')
          // this.router.navigateByUrl('/application/dashboard');
          setTimeout(() => {
            this.utilService.logOut()
            }, 500);
        },
        (error) => {
         this.isLoading = false;
          if (error && error.error.errors && error.error.errors.failed) {
            this.toastrService.danger(error.error.errors.failed[0],'Error');
          }else
          if (error && error.error.errors && error.error.errors.new_password) {
            this.toastrService.danger(error.error.errors.new_password[0],'Error');
          }else
          if (error && error.error.errors && error.error.errors.current_password) {
            this.toastrService.danger(error.error.errors.current_password[0],'Error');
          }
        }
      ));
    }
  }

  //match confim_pass //
  public  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('new_password');
    const { value: confirmPassword } = formGroup.get('confirm_password');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  public onReset (){
    this.changePassFrom.reset()
  }
public ngOnDestroy() {
    this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
}    

}
