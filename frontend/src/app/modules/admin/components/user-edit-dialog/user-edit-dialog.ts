import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../../services/user';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.html',
  styleUrls: ['./user-edit-dialog.css'],
  standalone: false
})
export class UserEditDialogComponent {
  editForm: FormGroup;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.editForm = this.fb.group({
      firstname: [data.user.firstname, Validators.required],
      lastname: [data.user.lastname, Validators.required],
      email: [data.user.email, [Validators.required, Validators.email]],
      phone: [data.user.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      status: [data.user.status, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.editForm.valid) {
      this.userService.updateUser(this.data.user.id!, this.editForm.value).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          this.errorMessage = 'Update failed. Check details.';
          console.error('Update failed', err);
        }
      });
    }
  }
}