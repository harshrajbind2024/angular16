import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
        {path: 'employee-experience/dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(x => x.DashboardModule)},
        {path: 'employee-experience/sentiments', loadChildren: () => import('./sentiments/sentiments.module').then(x => x.SentimentsModule)},
        {path: 'employee-experience/engagement-insights', loadChildren: () => import('./engagement-insights/engagement-insights.module').then(x => x.EngagementInsightsModule)},
        {path: 'employee-experience/action-insights', loadChildren: () => import('./action-insights/action-insights.module').then(x => x.ActionInsightsModule)},
        {path: 'employee-experience/reports', loadChildren: () => import('./reports/reports.module').then(x => x.ReportsModule)},
        {path: 'employee-experience/roi-calculator', loadChildren: () => import('@lib/umwelt-lib').then(x => x.RoiCalculatorModule)},
  ]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes),
  ],
  declarations: [],
})
export class PagesModule {}