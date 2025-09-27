import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCreditCardPage } from './new-credit-card.page';

describe('NewCreditCardPage', () => {
  let component: NewCreditCardPage;
  let fixture: ComponentFixture<NewCreditCardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCreditCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
