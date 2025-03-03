import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcuerdoTutorialPage } from './acuerdo-tutorial.page';

describe('AcuerdoTutorialPage', () => {
  let component: AcuerdoTutorialPage;
  let fixture: ComponentFixture<AcuerdoTutorialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcuerdoTutorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
