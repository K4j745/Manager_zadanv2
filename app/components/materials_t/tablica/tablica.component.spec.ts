import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablicaComponent } from './tablica.component';

describe('TablicaComponent', () => {
  let component: TablicaComponent;
  let fixture: ComponentFixture<TablicaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TablicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
