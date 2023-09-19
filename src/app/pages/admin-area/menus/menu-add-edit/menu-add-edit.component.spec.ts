import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAddEditComponent } from './menu-add-edit.component';

describe('MenuAddEditComponent', () => {
  let component: MenuAddEditComponent;
  let fixture: ComponentFixture<MenuAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
