import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonsaiComponent } from './bonsai.component';

describe('BonsaiComponent', () => {
  let component: BonsaiComponent;
  let fixture: ComponentFixture<BonsaiComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BonsaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
