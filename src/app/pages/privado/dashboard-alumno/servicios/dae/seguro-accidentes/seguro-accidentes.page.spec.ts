import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguroAccidentesPage } from './seguro-accidentes.page';

describe('SeguroAccidentesPage', () => {
  let component: SeguroAccidentesPage;
  let fixture: ComponentFixture<SeguroAccidentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguroAccidentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
