// services/credit-card.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreditCard } from '../models/credit-card.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  private cards: CreditCard[] = [  ];

  private cardsSubject = new BehaviorSubject<CreditCard[]>(this.cards);
  cards$ = this.cardsSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadTarjetas();
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
        gastos: [
          { 
            id: 1, 
            name: 'Restaurante', 
            amount: 50000, 
            date: '2024-02-12',
            cuotas: 3,
            total: 150000
          },
          { 
            id: 2, 
            name: 'Supermercado',
            amount: 80000,
            date: '2024-05-15',
            cuotas: 6,
            total: 480000
          }
        ]
      },
      { 
        id: 2, 
        name: 'Mastercard Coopeuch' ,
        gastos: [{ 
            id: 1, 
            name: 'Salida al cine', 
            amount: 50000, 
            date: '2024-05-12',
            cuotas: 3,
            total: 150000
          },
          { 
            id: 2, 
            name: 'Pizzas',
            amount: 80000,
            date: '2024-05-15',
            cuotas: 6,
            total: 480000
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


  // Create
  public async addCard(card: CreditCard) {
    this.cards.push(card);
    this.cardsSubject.next(this.cards);
    await this.saveTarjetas();
  }

  // Read
  getTarjetas(id?: number): CreditCard | CreditCard[] | undefined {
    console.log(id)
    if (id !== undefined) {
      return this.cards.find(t => t.id == id);
    }
    return this.cards;
  }

  // Update
  updateCard(updatedCard: CreditCard) {
    this.cards = this.cards.map(c => c.id == updatedCard.id ? updatedCard : c);
    this.cardsSubject.next(this.cards);
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

  createExpense(cardId: number, expense: { id: number; name: string; amount: number; date: string; cuotas: number; total: number }) {
    const card = this.cards.find(c => c.id == cardId);
    if (card) {
      card.gastos.push(expense);
      this.cardsSubject.next([...this.cards]);
    }

    
    this.saveTarjetas();
  }

  getGastosProyectados(cardId: number) {
    const cardsToProcess = cardId != 0
      ? this.cards.filter(c => c.id == cardId )
      : this.cards;

    const allGastos = cardsToProcess.reduce((acc, c) => acc.concat(c.gastos), [] as any[]);

    // Aquí tu misma lógica de proyección mensual con cuotas
    const proyeccion: {mesNumero: number; mes: string; total: number }[] = [];

    allGastos.forEach((gasto: any) => {
      const fecha = new Date(gasto.date);
      for (let i = 0; i < gasto.cuotas; i++) {
        const mes = new Date(fecha.getFullYear(), fecha.getMonth() + i, 1);
        
        const clave = this.formatFecha(mes.toISOString());

        const existente = proyeccion.find(p => p.mes === clave);
        if (existente) {
          existente.total += gasto.amount;
        } else {
          proyeccion.push({mesNumero:fecha.getMonth(), mes: clave, total: gasto.amount });
        }
      }
    });

    return proyeccion.sort((a, b) =>
      a.mesNumero - b.mesNumero
    );
  }

  formatFecha(fecha: string): string {
    const d = new Date(fecha);

    // Esto da "mayo de 2024"
    let texto = d.toLocaleDateString("es-CL", {
      month: "long",
      year: "numeric"
    });

    // Quitar " de"
    texto = texto.replace(" de", "");

    // Poner mayúscula en la primera letra
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }
}
