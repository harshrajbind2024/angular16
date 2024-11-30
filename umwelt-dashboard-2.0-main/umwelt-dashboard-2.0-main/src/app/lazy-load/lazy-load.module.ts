import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { LayoutComponent } from '../layout/layout.component';
import { EnsureAuthenticatedService } from '@lib/umwelt-lib';

const routes: Routes = [
    {
      path: 'auth', component: LayoutComponent,
      loadChildren: () => import('../pages/pages.module').then(x => x.PagesModule),
      canLoad: [EnsureAuthenticatedService]
    },
    {
      path: '**', 
      redirectTo: '/auth/employee-experience/dashboard',
    }
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class LazyLoadModule {}