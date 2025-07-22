import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerZadan } from './manager-zadan';

describe('ManagerZadan', () => {
  let component: ManagerZadan;
  let fixture: ComponentFixture<ManagerZadan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerZadan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerZadan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
