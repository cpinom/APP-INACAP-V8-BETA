import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardAlumnoPage } from './dashboard-alumno.page';

describe('DashboardAlumnoPage', () => {
  let component: DashboardAlumnoPage;
  let fixture: ComponentFixture<DashboardAlumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAlumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
