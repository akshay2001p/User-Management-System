import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list';
import { AdminGuard } from '../../guards/admin-guard';

const routes: Routes = [
  { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: 'users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
