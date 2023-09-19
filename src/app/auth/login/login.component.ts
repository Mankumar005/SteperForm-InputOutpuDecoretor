import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbAuthService } from '@nebular/auth';
import { UtilService } from '../../shared/common- services/util.service';
import { loginService } from '../../shared/auth-services/auth-component-services/login-service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  public subscription: Subscription[] = [];
 
  public loginForm!: FormGroup;

  public isLoading : boolean= false;
  public hide : boolean = true;
  public isLogedIn : boolean = false;
  public showPassword: boolean = false;

  public formValidations: any = {
    email: [
      { type: "required", message: "Email is required" },
      { type: "pattern", message: "Enter valid email" },
    ],
    password: [
      { type: "required", message: "Password is required" },
    ],
  };

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public authService: loginService,
    public router : Router,
    private toastrService: NbToastrService,
    ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,Validators.pattern(this.utilService._emialRegExp)]],
      password: ['',[Validators.required]],
  });
  }


public isHideShow(){
    this.showPassword = !this.showPassword 
  }


public onSubmit() {
    this.isLoading = true
    this.loginForm.get("email")?.setValue((this.loginForm.get("email")
    ?.value? this.loginForm.get("email")?.value : " ").trim());
    this.loginForm.get("password")?.setValue((this.loginForm.get("password")
    ?.value? this.loginForm.get("password")?.value : " ").trim());
  this.loginForm.updateValueAndValidity();
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.isLoading = false;
      return;
    }
    let basicDetailForm = this.loginForm.value
      basicDetailForm.email = this.utilService.convertStringBase64(basicDetailForm.email);
      basicDetailForm.password = this.utilService.convertStringBase64(basicDetailForm.password);
      this.subscription.push(this.authService.userSignIn(basicDetailForm).subscribe((res: any) => {   
        this.isLoading = false;
        this.toastrService.success(res.message,'Success')
        this.utilService.storeLocalStorageValue('userDetail',res.data);
        this.utilService.storeLocalStorageValue('access_token',res.access_token,false);
        setTimeout(() => {
        this.router.navigateByUrl('/pages/dashboard');
        }, 500);
      }, error => {
        this.isLoading = false;
        this.isLogedIn = true;
        if(error && error.error.errors && error.error.errors.failed) {
          // this.utilService.showError(error.error.errors.failed[0]);
          this.toastrService.danger(error.error.errors.failed[0],'Error')
        }
        if(error && error.error.errors && error.error.errors.password) {
          // this.utilService.showError(error.error.errors.password[0]);
          this.toastrService.danger(error.error.errors.password[0],'Error')

        }
        setTimeout(() => {
          this.isLogedIn = false;
        },3000);
      }));
  }

public redirectToSingUp(){
  this.router.navigate(['auth/sign-up'])
} 

public ngOnDestroy() {
  this.subscription.forEach((subscriptions) => subscriptions.unsubscribe());
} 

}
