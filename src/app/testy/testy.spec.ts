import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testy } from './testy';

describe('Testy', () => {
  let component: Testy;
  let fixture: ComponentFixture<Testy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testy],
    }).compileComponents();

    fixture = TestBed.createComponent(Testy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
