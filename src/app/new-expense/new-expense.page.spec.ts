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
});
