import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaZadComponent } from './lista-zad';

describe('ListaZad', () => {
  let component: ListaZadComponent;
  let fixture: ComponentFixture<ListaZadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaZadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaZadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
