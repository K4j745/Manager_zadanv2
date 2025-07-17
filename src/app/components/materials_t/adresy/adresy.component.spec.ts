import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdresyComponent } from './adresy.component';

describe('AdresyComponent', () => {
  let component: AdresyComponent;
  let fixture: ComponentFixture<AdresyComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdresyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
