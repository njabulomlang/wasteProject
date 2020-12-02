import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

// import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { FolderPage } from './folder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // NgbPaginationModule,
    FolderPageRoutingModule,
  ],
    declarations: [FolderPage]
})
export class FolderPageModule {}
