import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService, NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { UtilService } from '../../../shared/common- services/util.service';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../../shared/modal-services/confirm-modal/confirm-modal.component';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public userPictureOnly: boolean = false;
  public user: any = null;
  public userDetails: any = null;

  public currentTheme = "default";
  // { title: "Profile" },
  public userMenu = [{ title: "Profile" },{ title: "Change Password" }, { title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    public authService: NbAuthService,
    private dialogService: NbDialogService,
    private breakpointService: NbMediaBreakpointsService,
    public utilService: UtilService,
    public router : Router
  ) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.userDetails = this.utilService.getLocalStorageValue("userDetail");
    this.userDetails.name = this.userDetails.first_name + ' ' + this.userDetails.last_name
    
    this.userService.getUsers().subscribe((users: any) => (this.user = users.nick));
       this.menuService.onItemClick().subscribe((event) => {
        this.onItemSelection(event.item.title);
    });
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService.onThemeChange().pipe( map(({ name }) => name),takeUntil(this.destroy$))
      .subscribe((themeName) => (this.currentTheme = themeName));
  }

public changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

public onItemSelection(title:any) {
    if (title === "Profile") {
      this.router.navigate(['pages/profile'])
    }
    if (title === "Change Password") {
      this.router.navigate(['pages/change-password'])
    }
    if (title === "Log out") {
      this.logOut()
    }
  }
  public logOut(): void {
    this.dialogService.open(ConfirmModalComponent, {
      context: {
        data: "Are you sure want to log out?",
      },
    })
      .onClose.subscribe((confirm: any) => {
        if (confirm) {
          localStorage.removeItem("auth_app_token");
          localStorage.removeItem("userDetail");
          localStorage.removeItem("access_token");
          this.router.navigate(['auth/login'])
        }
      });
}
public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

public navigateHome() {
  this.router.navigate(['pages/dashboard'])
    this.menuService.navigateHome();
    return false;
  }

public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
