import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'credit-card',
    loadComponent: () => import('./credit-card/credit-card.page').then( m => m.CreditCardPage)
  },
  {
    path: 'new-credit-card',
    loadComponent: () => import('./new-credit-card/new-credit-card.page').then( m => m.NewCreditCardPage)
  },
  {
    path: 'new-expense',
    loadComponent: () => import('./new-expense/new-expense.page').then( m => m.NewExpensePage)
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.page').then( m => m.AnalyticsPage)
  },
  {
    path: 'fixed-expenses',
    loadComponent: () => import('./fixed-expenses/fixed-expenses.page').then( m => m.FixedExpensesPage)
  },
];
