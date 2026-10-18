import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { CreditCardService } from '../services/credit-card.service';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../models/credit-card.model';
import { DatePicker } from '@capgo/capacitor-date-picker';


@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.page.html',
  styleUrls: ['./new-expense.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NewExpensePage implements OnInit {

  expense: Expense = {
    id: 0,
    name: null,
    amount: null,
    date: null,
    cuotas: null,
    total: null,
    fechaPrimerVencimiento: null,
    fechaUltimoVencimiento: null
  };
  nf: Intl.NumberFormat;
  amountInput = '';
  idCreditCard: number = 0;
  editing = false;
  
  @ViewChild('inputEle') inputEle: ElementRef | undefined;

  constructor(private navCtrl: NavController,private cardService: CreditCardService,private route: ActivatedRoute) { 
    this.nf = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
  }

 async ngOnInit() {
    const params = this.route.snapshot.queryParams;
    this.idCreditCard = Number(params['id']);
    const expenseId = Number(params['expenseId']);
    const card = this.cardService.getTarjetas(this.idCreditCard);
    if (expenseId && card && !Array.isArray(card)) {
      const current = card.gastos.find(item => item.id === expenseId);
      if (current) {
        this.expense = { ...current };
        this.expense.date = this.toDateInput(current.date);
        this.amountInput = this.formatAmount(current.total);
        this.editing = true;
      }
    }

  

  }

  async openDatePicker(){
    
    const result = await DatePicker.present({
      mode: 'date',
      
      format: 'yyyy-MM-dd',
      title: 'Select a date',
    });
    this.expense.date = this.toDateInput(result.value!.toString());

    
  }
  goBack() {
    this.navCtrl.back(); // vuelve a la página anterior en el stack
  }

  addExpense() {
    const total = Number(this.expense.total);
    const cuotas = Math.floor(Number(this.expense.cuotas));
    if (!this.expense.name?.trim() || !this.expense.date || !Number.isFinite(total) || total <= 0 || cuotas < 1) return;

    const card = this.cardService.getTarjetas(this.idCreditCard);
    if (!card || Array.isArray(card)) return;
    const firstDueDate = this.calcularFechaPrimerVencimiento(this.parseLocalDate(this.expense.date.toString()));
    const lastDueDate = this.calcularFechaUltimoVencimiento(firstDueDate, cuotas);
    const nextExpense: Expense = {
      ...this.expense,
      id: this.editing ? this.expense.id : Math.max(0, ...card.gastos.map(item => item.id)) + 1,
      name: this.expense.name?.trim(),
      total,
      cuotas,
      amount: total / cuotas,
      fechaPrimerVencimiento: firstDueDate,
      fechaUltimoVencimiento: lastDueDate
    };
    
    if (this.editing) this.cardService.updateExpense(this.idCreditCard, nextExpense);
    else this.cardService.createExpense(this.idCreditCard, nextExpense);
    this.goBack();
  }

  private today(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  private toDateInput(value: string | Date | null): string {
    if (value instanceof Date) return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
    return value?.slice(0, 10) || '';
  }

  private parseLocalDate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  calcularFechaPrimerVencimiento(fecha: Date): Date {
    return new Date(
      fecha.getFullYear(),
      fecha.getMonth() + (fecha.getDate() <= 15 ? 1 : 2),
      1
    );
  }

  calcularFechaUltimoVencimiento(fechaPrimerVencimiento: Date, cuotas: number): Date {
    const fechaUltimoVencimiento = new Date(fechaPrimerVencimiento);
    fechaUltimoVencimiento.setMonth(fechaUltimoVencimiento.getMonth() + cuotas - 1);
    return fechaUltimoVencimiento;
  }

  onAmountInput(value: string) {
    const input = this.inputEle?.nativeElement as HTMLInputElement | undefined;
    const digitsBeforeCursor = input
      ? (input.value.slice(0, input.selectionStart ?? input.value.length).match(/\d/g) ?? []).length
      : 0;
    const digits = value.replace(/\D/g, '');

    this.expense.total = digits ? Number(digits) : null;
    this.amountInput = digits ? this.nf.format(this.expense.total!) : '';

    if (input) {
      input.value = this.amountInput;
      let cursorPosition = 0;
      let digitCount = 0;
      while (cursorPosition < this.amountInput.length && digitCount < digitsBeforeCursor) {
        if (/\d/.test(this.amountInput[cursorPosition])) digitCount++;
        cursorPosition++;
      }
      input.setSelectionRange(cursorPosition, cursorPosition);
    }
  }

  private formatAmount(value: number | null): string {
    return value === null ? '' : this.nf.format(value);
  }

}
