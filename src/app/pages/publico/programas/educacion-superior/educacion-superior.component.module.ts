import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { EducacionSuperiorComponent } from "./educacion-superior.component";
import { RouterModule } from "@angular/router";

@NgModule({
  schemas: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule
  ],
  exports: [EducacionSuperiorComponent],
  declarations: [EducacionSuperiorComponent]
})
export class EducacionSuperiorComponentModule { }