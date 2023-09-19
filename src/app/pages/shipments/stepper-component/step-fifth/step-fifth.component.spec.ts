import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFifthComponent } from './step-fifth.component';

describe('StepFifthComponent', () => {
  let component: StepFifthComponent;
  let fixture: ComponentFixture<StepFifthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepFifthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepFifthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
