import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewExpensePage } from './new-expense.page';

describe('NewExpensePage', () => {
  let component: NewExpensePage;
  let fixture: ComponentFixture<NewExpensePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExpensePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formats the amount while keeping its numeric value', () => {
    component.onAmountInput('1234567');

    expect(component.amountInput).toBe('1.234.567');
    expect(component.expense.total).toBe(1234567);
  });
});
