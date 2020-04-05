// External Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Internal Imports
import { CoreModule } from '@app/core/core.module';
import { RoleRoutingModule } from '@app/role/role-routing.module';
import { RoleListComponent } from '@app/role/role-list/role-list.component';
import { RoleEditComponent } from '@app/role/role-edit/role-edit.component';

@NgModule({
  declarations: [RoleListComponent, RoleEditComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }
