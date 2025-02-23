import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SedePage } from './sede.page';

describe('SedePage', () => {
  let component: SedePage;
  let fixture: ComponentFixture<SedePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SedePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
