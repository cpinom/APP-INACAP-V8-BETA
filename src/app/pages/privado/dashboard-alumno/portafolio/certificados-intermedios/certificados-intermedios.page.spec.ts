import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadosIntermediosPage } from './certificados-intermedios.page';

describe('CertificadosIntermediosPage', () => {
  let component: CertificadosIntermediosPage;
  let fixture: ComponentFixture<CertificadosIntermediosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadosIntermediosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
