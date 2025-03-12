import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleInacapPage } from './detalle-inacap.page';

describe('DetalleInacapPage', () => {
  let component: DetalleInacapPage;
  let fixture: ComponentFixture<DetalleInacapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleInacapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
