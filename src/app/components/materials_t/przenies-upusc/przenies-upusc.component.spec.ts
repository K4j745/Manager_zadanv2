import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrzeniesUpuscComponent } from './przenies-upusc.component';

describe('PrzeniesUpuscComponent', () => {
  let component: PrzeniesUpuscComponent;
  let fixture: ComponentFixture<PrzeniesUpuscComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrzeniesUpuscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
