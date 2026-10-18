export interface CreditCard {
  id: number;
  name: string;
  diaCorte: number;
  gastos: Expense[];
}

export interface Expense {
  id: number ;
  name: string | null;
  amount: number | null;
  date: string | Date | null;
  cuotas: number | null;
  total: number | null;
  fechaPrimerVencimiento: Date | null;
  fechaUltimoVencimiento: Date | null;
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