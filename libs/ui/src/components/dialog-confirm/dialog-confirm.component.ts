import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'lib-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  imports: [MatCardModule],
})
export class DialogConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string; labelButton: string },
    private dialogRef: MatDialogRef<DialogConfirmComponent>
  ) {}

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
