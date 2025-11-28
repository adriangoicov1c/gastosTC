export interface CreditCard {
  id: number;
  name: string;
  gastos: Expense[];
}

export interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  cuotas: number;
  total: number;
}

export interface MonthlyExpense {
  mes: string;   // Ej: "mayo 2024"
  total: number; // Total de ese mes
}

export interface FixedExpense {
  id: number;
  name: string;
  amount: number;
}