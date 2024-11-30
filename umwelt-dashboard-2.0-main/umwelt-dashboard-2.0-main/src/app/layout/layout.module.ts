import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import {MatLegacyButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTooltipModule} from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgScrollbarModule } from 'ngx-scrollbar';

import { FullscreenModule, SidemenuModule } from '@lib/umwelt-lib';
import { UserMenuModule } from '@lib/umwelt-lib';
import { ToolbarNotificationModule } from '@lib/umwelt-lib';
import { ParentOuFiltersModule } from '@lib/umwelt-lib';

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDatepickerModule,
    RouterModule,
    FlexLayoutModule,
    NgScrollbarModule,
    MatLegacyButtonModule,
    MatLegacyTooltipModule,
    FullscreenModule,
    UserMenuModule,
    ToolbarNotificationModule,
    ParentOuFiltersModule,
    SidemenuModule
  ],
  exports: [
    LayoutComponent,
    ToolbarComponent
  ]
})
export class LayoutModule { }