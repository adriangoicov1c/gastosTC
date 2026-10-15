// services/credit-card.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreditCard, Expense, FixedExpense } from '../models/credit-card.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  private cards: CreditCard[] = [  ];
  private gastos: FixedExpense[] = [];

  private cardsSubject = new BehaviorSubject<CreditCard[]>(this.cards);
  private gastosSubject = new BehaviorSubject<FixedExpense[]>(this.gastos);

  cards$ = this.cardsSubject.asObservable();  
  gastos$ = this.gastosSubject.asObservable();
  

  constructor(private storageService: StorageService) {
    this.loadTarjetas();
    this.loadGastos();
  }



  async loadGastos() {
    
    const stored = await this.storageService.getGastos();

    //const stored = null;
    if (stored) {
      this.gastos = stored;
    } else {
      // Si no hay datos, inicializa con los de ejemplo
      this.gastos =[];
      await this.saveGastos();
    }
    this.gastosSubject.next(this.gastos);
  }

  
   async loadTarjetas() {
    
    const stored = await this.storageService.getTarjetas();

    //const stored = null;
    if (stored) {
      this.cards = stored;
    } else {
      // Si no hay datos, inicializa con los de ejemplo
      this.cards =[
      { 
        id: 1, 
        name: 'Visa BCI' ,
        diaCorte: 15,
        gastos: [
          { 
            id: 1, 
            name: 'Restaurante', 
            amount: 50000, 
            date: '2024-02-12',
            cuotas: 3,
            total: 150000,
            fechaPrimerVencimiento: new Date('2024-03-01'),
            fechaUltimoVencimiento: new Date('2024-05-01')
          },
          { 
            id: 2, 
            name: 'Supermercado',
            amount: 80000,
            date: '2024-05-15',
            cuotas: 6,
            total: 480000,
            fechaPrimerVencimiento: new Date('2024-06-01'),
            fechaUltimoVencimiento: new Date('2024-11-01')
          }
        ]
      },
      { 
        id: 2, 
        name: 'Mastercard Coopeuch' ,
        diaCorte: 20,
        gastos: [{ 
            id: 1, 
            name: 'Salida al cine', 
            amount: 50000, 
            date: '2024-05-12',
            fechaPrimerVencimiento: new Date('2024-06-01'),
            fechaUltimoVencimiento: new Date('2024-08-01'),
            cuotas: 3,
            total: 150000
          },
          { 
            id: 2, 
            name: 'Pizzas',
            amount: 80000,
            date: '2024-05-15',
            cuotas: 6,
            total: 480000,
            fechaPrimerVencimiento: new Date('2024-06-01'),
            fechaUltimoVencimiento: new Date('2024-11-01')
          }]
      }
    ];
      await this.saveTarjetas();
    }
    this.cardsSubject.next(this.cards);
  }

   async saveTarjetas() {
    await this.storageService.setTarjetas(this.cards);
    this.cardsSubject.next(this.cards);
  }

  async saveGastos() {
    await this.storageService.setGastos(this.gastos);
    this.gastosSubject.next(this.gastos);
  }


  // Create
  public async addCard(card: CreditCard) {
    this.cards.push(card);
    this.cardsSubject.next(this.cards);
    await this.saveTarjetas();
    
  }

  public async addGasto(gasto: FixedExpense) {
    this.gastos.push(gasto);
    await this.saveGastos();
  }

  // Read
  getTarjetas(id?: number): CreditCard | CreditCard[] | undefined {
    if (id !== undefined) {
      return this.cards.find(t => t.id == id);
    }
    return this.cards;
  }

  // Update
  updateCard(updatedCard: CreditCard) {
    this.cards = this.cards.map(c => c.id == updatedCard.id ? updatedCard : c);
    this.cardsSubject.next([...this.cards]);
    void this.saveTarjetas();
  }

  // Delete
  deleteCard(id: number | string): boolean {
    const idNum = typeof id === 'string' ? parseInt(id, 10) : id;
    console.log('[CreditCardService] deleteCard called with id:', id, 'parsed:', idNum);

    const prevLength = this.cards.length;
    this.cards = this.cards.filter(c => c.id !== idNum);
    const deleted = this.cards.length < prevLength;

    if (deleted) {
      // siempre emitir un nuevo array para OnPush y async pipe
      this.cardsSubject.next([...this.cards]);
      console.log('[CreditCardService] card deleted, new list:', this.cards);
    } else {
      console.warn('[CreditCardService] no card deleted (id not found)', idNum);
    }

    return deleted;
  }


  deleteExpense(cardId: number | string, expenseId: number | string): boolean {
    const parsedCardId = Number(cardId);
    const parsedExpenseId = Number(expenseId);
    const card = this.cards.find(c => c.id === parsedCardId);
    if (!card) return false;

    const expenses = card.gastos.filter(expense => expense.id !== parsedExpenseId);
    if (expenses.length === card.gastos.length) return false;

    this.cards = this.cards.map(c => c.id === parsedCardId ? { ...c, gastos: expenses } : c);
    this.cardsSubject.next([...this.cards]);
    void this.saveTarjetas();
    return true;
  }


  createExpense(cardId: number, expense: Expense) {
    const card = this.cards.find(c => c.id == cardId);
    if (card) {
      card.gastos = [...card.gastos, expense];
      this.cardsSubject.next([...this.cards]);
      void this.saveTarjetas();
    }
  }

  updateExpense(cardId: number, updatedExpense: Expense): boolean {
    const card = this.cards.find(c => c.id === Number(cardId));
    if (!card || !card.gastos.some(expense => expense.id === updatedExpense.id)) return false;

    this.cards = this.cards.map(c => c.id === Number(cardId)
      ? { ...c, gastos: c.gastos.map(expense => expense.id === updatedExpense.id ? updatedExpense : expense) }
      : c);
    this.cardsSubject.next([...this.cards]);
    void this.saveTarjetas();
    return true;
  }

  getGastosProyectados(cardId: number = 0) {
    const cardsToProcess = cardId != 0
      ? this.cards.filter(c => c.id == cardId )
      : this.cards;

    const allGastos = cardsToProcess.reduce((acc, c) => acc.concat(c.gastos), [] as any[]);

    // Aquí tu misma lógica de proyección mensual con cuotas
    const porMes = new Map<string, number>();

    allGastos.forEach((gasto: Expense) => {
      const cuotas = Math.max(1, Number(gasto.cuotas) || 1);
      const inicio = this.parseLocalDate(gasto.fechaPrimerVencimiento || gasto.date);
      const montoCuota = Number(gasto.amount) || (Number(gasto.total) / cuotas);
      for (let i = 0; i < cuotas; i++) {
        const fechaCuota = new Date(inicio.getFullYear(), inicio.getMonth() + i, 1);
        const clave = `${fechaCuota.getFullYear()}-${String(fechaCuota.getMonth() + 1).padStart(2, '0')}`;
        porMes.set(clave, (porMes.get(clave) || 0) + montoCuota);
      }
    });

    return [...porMes.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([mes, total]) => ({
      mes: this.formatFecha(`${mes}-01`),
      total
    }));
  }

  private parseLocalDate(value: string | Date): Date {
    if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    const [year, month, day] = value.slice(0, 10).split('-').map(Number);
    return new Date(year, (month || 1) - 1, day || 1);
  }

  formatFecha(fecha: string): string {
    const d = new Date(fecha);

    // Esto da "mayo de 2024"
    let texto = this.parseLocalDate(fecha).toLocaleDateString("es-CL", {
      month: "long",
      year: "numeric"
    });

    // Quitar " de"
    texto = texto.replace(" de", "");

    // Poner mayúscula en la primera letra
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
