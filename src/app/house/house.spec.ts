import { ComponentFixture, TestBed } from '@angular/core/testing';

import { House } from './house';

describe('House', () => {
  let component: House;
  let fixture: ComponentFixture<House>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [House]
    })
    .compileComponents();

    fixture = TestBed.createComponent(House);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
