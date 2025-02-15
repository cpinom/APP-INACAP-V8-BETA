import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardExalumnoPage } from './dashboard-exalumno.page';

describe('DashboardExalumnoPage', () => {
  let component: DashboardExalumnoPage;
  let fixture: ComponentFixture<DashboardExalumnoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardExalumnoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
