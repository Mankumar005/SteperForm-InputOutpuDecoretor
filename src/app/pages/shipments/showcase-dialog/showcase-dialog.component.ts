import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent {
  public goodsDescription = new FormControl('');
  @Input() title: string;
  @Input() dialogName: any;

  constructor(protected ref: NbDialogRef<ShowcaseDialogComponent>) {}

  saveDescription() {
    this.ref.close(this.goodsDescription.value);
  }

  dismiss(value: any) {
    this.ref.close(value);
  }
}
