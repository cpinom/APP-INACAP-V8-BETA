import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { EducacionSuperiorComponent } from "./educacion-superior.component";

@NgModule({
  schemas: [],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [EducacionSuperiorComponent],
  declarations: [EducacionSuperiorComponent]
})
export class EducacionSuperiorComponentModule { }