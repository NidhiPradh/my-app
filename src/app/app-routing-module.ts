import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParentComponent } from './Parent/parent.component';
import { App } from './app';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },

  {
    path: '',
    loadChildren: () =>
      //import('./auth/auth.module').then(m => m.AuthModule)
    import('./auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
