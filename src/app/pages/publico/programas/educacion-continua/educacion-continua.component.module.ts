import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { EducacionContinuaComponent } from "./educacion-continua.component";

@NgModule({
    schemas: [],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule
    ],
    exports: [EducacionContinuaComponent],
    declarations: [EducacionContinuaComponent]
})
export class EducacionContinuaComponentModule { }