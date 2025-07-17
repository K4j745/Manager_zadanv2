import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrziComponent } from './grzi.component';

describe('GrziComponent', () => {
  let component: GrziComponent;
  let fixture: ComponentFixture<GrziComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
