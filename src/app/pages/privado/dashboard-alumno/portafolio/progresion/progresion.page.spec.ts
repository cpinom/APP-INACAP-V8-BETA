import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgresionPage } from './progresion.page';

describe('ProgresionPage', () => {
  let component: ProgresionPage;
  let fixture: ComponentFixture<ProgresionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgresionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
