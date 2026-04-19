import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { App } from './app';
import { AuthGuard } from './core/guards/auth.guard';

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
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./products/product.module').then(m => m.ProductModule)
    //canActivate: [AuthGuard]
  },
  { path: 'samples', 
    loadChildren: () => 
      import('./samples/sample.module').then(m => m.SampleModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
