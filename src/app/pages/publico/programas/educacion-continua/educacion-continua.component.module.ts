import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { EducacionContinuaComponent } from "./educacion-continua.component";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "src/app/core/directives/directives.module";

@NgModule({
  schemas: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DirectivesModule
  ],
  exports: [EducacionContinuaComponent],
  declarations: [EducacionContinuaComponent]
})
export class EducacionContinuaComponentModule { }