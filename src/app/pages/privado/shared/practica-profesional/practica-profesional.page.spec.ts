import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticaProfesionalPage } from './practica-profesional.page';

describe('PracticaProfesionalPage', () => {
  let component: PracticaProfesionalPage;
  let fixture: ComponentFixture<PracticaProfesionalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticaProfesionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
