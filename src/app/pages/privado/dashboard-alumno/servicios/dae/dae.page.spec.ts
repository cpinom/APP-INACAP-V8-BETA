import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaePage } from './dae.page';

describe('DaePage', () => {
  let component: DaePage;
  let fixture: ComponentFixture<DaePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DaePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
