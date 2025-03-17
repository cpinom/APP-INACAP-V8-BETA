import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosEmergenciaPage } from './datos-emergencia.page';

describe('DatosEmergenciaPage', () => {
  let component: DatosEmergenciaPage;
  let fixture: ComponentFixture<DatosEmergenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosEmergenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
