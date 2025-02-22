import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortafolioPage } from './portafolio.page';

describe('PortafolioPage', () => {
  let component: PortafolioPage;
  let fixture: ComponentFixture<PortafolioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PortafolioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
