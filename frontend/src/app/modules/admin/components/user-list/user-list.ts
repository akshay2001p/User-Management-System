import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UserService } from '../../../../services/user';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
  standalone: false
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  searchControl = new FormControl();
  statusFilter = '';
  displayedColumns: string[] = ['firstname', 'lastname', 'email', 'phone', 'status', 'actions'];
  loading = true;

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadUsers();
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.loadUsers());
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers(this.searchControl.value || undefined, this.statusFilter).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loading = false;
      }
    });
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.statusFilter = '';
    this.loadUsers();
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: { user }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  approveUser(id: number) {
    if (confirm('Approve this user? Temporary password will be set.')) {
      this.userService.approveUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Approval failed', err)
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Delete this user? This action is irreversible.')) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}